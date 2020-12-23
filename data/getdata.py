import pandas as pd

df = pd.read_json("data/poverty.json")
df.columns = df.iloc[0]
df = df[1:]
df.sort_values(by="percent", ascending=True, inplace=True)
df.head()
# %% codecell
df.to_csv("data/poverty.csv", index=False)
# %% codecell
df = pd.read_csv("data/educationalattainment_race.csv")
df = df.replace(-888888888, 0)
df.head()
# %% codecell
df.describe()
