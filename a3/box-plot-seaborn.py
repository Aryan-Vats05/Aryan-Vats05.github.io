import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

# Load the CSV file
# Replace 'data.csv' with your actual CSV file path
df = pd.read_csv('fish.csv')

# Create a figure and axis
plt.figure(figsize=(10, 6))

# Create box plot
# Adjust the x and y parameters to match your CSV column names
sns.boxplot(data=df, y='Weight', width=0.3)

# Customize the plot
plt.title('SeaBorn Plot', fontsize=16, fontweight='bold')
plt.ylabel('Weight', fontsize=12)
plt.tight_layout()

plt.savefig('box_plot.png')