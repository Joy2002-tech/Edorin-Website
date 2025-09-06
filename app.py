# app.py
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import yfinance as yf
import time
import os

app = Flask(__name__, static_folder='site', static_url_path='')
CORS(app)

# Simple cache to avoid excessive calls to Yahoo
CACHE = {"ts": 0, "data": {}, "symbols_key": ""}
CACHE_TTL = 8  # seconds

def normalize_symbols(raw_symbols):
    """
    Accepts comma-separated tickers like 'INFY,RELIANCE,TCS'
    Adds .NS for NSE if no exchange suffix provided.
    """
    syms = []
    for s in raw_symbols.split(','):
        s = s.strip().upper()
        if not s:
            continue
        if '.' not in s:
            s = s + '.NS'
        syms.append(s)
    # dedupe preserve order
    seen = set(); out = []
    for x in syms:
        if x not in seen:
            seen.add(x); out.append(x)
    return out

def fetch_prices(symbols):
    """
    Fetch price data using yfinance and return mapping:
    { 'INFY.NS': {price, change, percent, timestamp}, ... }
    """
    results = {}
    now = time.time()
    # We'll attempt to fetch per-ticker to keep logic simple & robust
    for s in symbols:
        price = None; change = None; percent = None
        try:
            t = yf.Ticker(s)
            # Try fast_info (may provide last_price)
            try:
                fi = getattr(t, "fast_info", None)
                if fi and fi.get("last_price") is not None:
                    price = float(fi["last_price"])
            except Exception:
                pass

            # Try intraday history then daily fallbacks
            try:
                hist = t.history(period="2d", interval="1m", progress=False)
                if hist is not None and not hist.empty:
                    # pick last Close in intraday
                    if 'Close' in hist.columns:
                        last = hist['Close'].dropna().iloc[-1]
                        price = float(last)
                # fallback to daily
                if price is None:
                    histd = t.history(period="5d", interval="1d", progress=False)
                    if histd is not None and not histd.empty:
                        closes = histd['Close'].dropna()
                        if len(closes) >= 1:
                            price = float(closes.iloc[-1])
                            if len(closes) > 1:
                                prev = float(closes.iloc[-2])
                                change = price - prev
                                if prev != 0:
                                    percent = (change / prev) * 100
            except Exception:
                pass

            # If fast_info provided previous_close or change, try compute
            if price is not None and (change is None or percent is None):
                try:
                    info = t.info
                    prev_close = info.get('previousClose') or info.get('previous_close')
                    if prev_close:
                        change = price - float(prev_close)
                        if prev_close != 0:
                            percent = (change / float(prev_close)) * 100
                except Exception:
                    pass

        except Exception:
            # silent fail per symbol
            pass

        results[s] = {
            "symbol": s,
            "price": round(price, 2) if price is not None else None,
            "change": round(change, 2) if change is not None else None,
            "percent": round(percent, 2) if percent is not None else None,
            "timestamp": int(now)
        }
    return results

@app.route('/api/quotes')
def quotes():
    raw = request.args.get('symbols', '')
    if not raw:
        return jsonify({"ok": False, "error": "No symbols specified. Use ?symbols=INFY,RELIANCE"}), 400

    symbols = normalize_symbols(raw)
    key = ",".join(symbols)
    now = time.time()

    # Serve from cache if recent
    if CACHE["symbols_key"] == key and (now - CACHE["ts"] < CACHE_TTL):
        return jsonify({"ok": True, "cached": True, "data": CACHE["data"]})

    # Fetch new
    data = fetch_prices(symbols)

    # update cache
    CACHE["ts"] = now
    CACHE["data"] = data
    CACHE["symbols_key"] = key

    return jsonify({"ok": True, "cached": False, "data": data})

# Serve static site files
@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

# Serve other static files (assets etc.)
@app.route('/<path:path>')
def static_proxy(path):
    file_path = os.path.join(app.static_folder, path)
    if os.path.exists(file_path):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    # run dev server
    app.run(host='0.0.0.0', port=5000, debug=True)
