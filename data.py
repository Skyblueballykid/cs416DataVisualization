import pandas as pd
import yfinance as yf
import json

tickers = ["GME", "AMC", "BB", "SNDL", "KOSS"]

data = yf.download("GME AMC BB SNDL KOSS", start="2021-01-01", end="2021-07-14")

df = pd.DataFrame(data)
df.drop(['Close', 'High', 'Low', 'Open'], axis=1)
# df.to_csv("data.csv")

# print(df)

close = df['Adj Close']
vol = df['Volume']

close.to_json("close_prices.json")
vol.to_json("volume.json")

print(close)
print(vol)