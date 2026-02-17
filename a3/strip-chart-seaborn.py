import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

df = pd.read_csv('fish.csv')

plt.figure(figsize=(10, 6))

sns.stripplot(data=df, x='Species', y='Length1', jitter=True)

plt.title('Strip Chart – Fish Body Length', fontsize=16, fontweight='bold')
plt.xlabel('Species', fontsize=12)
plt.ylabel('Length1 (cm)', fontsize=12)
plt.tight_layout()

plt.savefig('strip_chart.png', dpi=300, bbox_inches='tight')