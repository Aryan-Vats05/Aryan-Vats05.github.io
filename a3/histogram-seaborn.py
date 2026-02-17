import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

df = pd.read_csv('fish.csv')

plt.figure(figsize=(16, 6))

sns.histplot(data=df, x='Species')

plt.title('Histogram Plot')
plt.xlabel('Species', fontsize=14)
#plt.ylabel(range(10, 80), fontsize=14)
plt.tight_layout()

plt.savefig('Histplot.png', dpi=300)


