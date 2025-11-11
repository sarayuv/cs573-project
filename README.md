# Visualizing Heart Disease Data

## Introduction
Heart disease is a leading cause of death across the world. Using data visualization techniques, we can explore the relationships between lifestyle factors and heart health.
For this project, I have created a set of interactive visualizations based on the [UCI Health Disease Dataset](https://www.kaggle.com/datasets/redwankarimsony/heart-disease-data). It is composed of 14 attributes, including:
* Demographics: age, sex
* Clinical measurements: resting blood pressure, serum cholesterol, fasting blood sugar
* Diagnostic test results: resting electrocardiographic results, maximum heart rate achieved, exercise-induced angina, ST depression (“oldpeak”), slope of the ST segment, number of major vessels, and Thalassemia

## Guiding Questions
To drive the visualization and interaction decisions for the project, I have defined a few analytical questions.
1. How does age distribution differ between people with and without heart disease?
2. Which chest pain types are most closely associated with heart disease?
3. How do cholesterol and resting blood pressure relate to heart disease presence?
4. Which features are most strongly correlated across the dataset?

These questions guided the design of four interactive visualizations, each addressing a specific aspect of the dataset.

## Sketches
Before coding the visualizations, I created hand-drawn sketches to plan out how users would explore the data:
* Scatterplot (Cholesterol vs. Blood Pressure): a point-based plot colored by heart disease presence, helping to reveal clustering patterns
* Stacked Bar Chart (Chest Pain Type): a categorical breakdown comparing chest pain types by disease status
* Histogram (Age Distribution): a simple yet powerful visualization showing how age correlates with heart disease
* Correlation Matrix: a heatmap summarizing pairwise relationships between all numerical variables
<img width="2244" height="2904" alt="image" src="https://github.com/user-attachments/assets/30dd4812-25eb-4093-a8ce-10787e7088ca" />

## Prototypes

I’ve created a proof of concept visualization of this data

### 1. Resting Blood Pressure vs. Cholesterol
<img width="829" height="432" alt="image" src="https://github.com/user-attachments/assets/35135eba-a53b-441f-81b5-66e4d7d6ec9a" />
[https://vizhub.com/sarayuv/b5de266a3453438a9058b5770a11f517
](https://vizhub.com/sarayuv/b5de266a3453438a9058b5770a11f517
)
This scatterplot explores the relationship between resting blood pressure and cholesterol, with colors indicating heart disease presence.
**Key Features:**
* Tooltips display detailed patient-level information
* Interactive color legend allows users to filter by heart disease status
* Coordinated color scheme for better readability
While there’s some variation, cholesterol and blood pressure don’t show a strong linear relationship with heart disease on their own. This suggests other variables may be stronger predictors

### 2. Heart Disease Presence by Chest Pain Type
<img width="829" height="432" alt="image" src="https://github.com/user-attachments/assets/f907c96a-28e8-4b57-bcac-cc24f9bd2e9c" />
[https://vizhub.com/sarayuv/c5a9aa4975e34d81afb760c862151e24
](https://vizhub.com/sarayuv/c5a9aa4975e34d81afb760c862151e24)
This stacked bar chart visualizes the percentage of patients with and without heart disease for each chest pain type.
**Key Features:**
* Stacked bars for visual comparison of proportions
* Interactive hover tooltips showing counts and percentages
* Clickable legend toggles visibility of groups.
Certain chest pain types, particularly those labeled “asymptomatic,” show a much higher rate of heart disease, confirming a strong categorical link.

### 3. Age by Heart Disease Status
<img width="829" height="432" alt="image" src="https://github.com/user-attachments/assets/d860f326-75c4-406e-bb45-6d16715c993d" />
[https://vizhub.com/sarayuv/1b729155a7f74a8e9510f8ec31a6e168
](https://vizhub.com/sarayuv/1b729155a7f74a8e9510f8ec31a6e168))
A histogram showing how the likelihood of heart disease changes across age groups.
**Key Features:**
* Overlapping histograms colored by disease status
* Smooth transitions for hover interactions
* Unified color palette consistent with other visualizations.
Heart disease prevalence increases significantly in middle-aged and older adults, as expected, but the visualization also highlights smaller proportions of younger individuals with early-onset cases.

### 4. Correlation Heatmap Matrix
<img width="829" height="432" alt="image" src="https://github.com/user-attachments/assets/8731b1af-a796-4b76-9ecc-0d2ae90ef346" />
[https://vizhub.com/sarayuv/0827c5cbfd9e4d6d9ffe6df253e5f7ab
](https://vizhub.com/sarayuv/0827c5cbfd9e4d6d9ffe6df253e5f7ab)
This heatmap displays correlations among all numeric variables.
**Key Features:**
* Hover tooltips show exact correlation coefficients
* Axis labels rotate for clarity
* Consistent labeling and color scaling across the project
Maximum heart rate and exercise-induced angina show strong relationships with disease presence, while age and ST depression also stand out as correlated features.

## Iteration and Refinement
Throughout the project, I iterated on my visualizations based on feedback:
1. Unified color schemes across all visualizations to ensure consistent readability
2. Standardized axis labeling and typography for a professional presentation
3. Improved interactivity with responsive legends and tooltips for all plots
These changes made the visualizations feel like a cohesive analytical dashboard rather than isolated charts.

## Open Questions
During the course of this project, I found that some scatterplots (cholesterol vs. resting blood pressure, for example) were not as informative as expected. While technically correct, they didn't reveal clear trends. This made me wonder what makes a visualization actually useful instead of simply accurate. 

## Next Steps
I plan to extend this project further by building an interactive dashboard that combines all four visualization in a single interface. I also would like to add filtering by gender or age group to see subgroup trends. I hope to integrate more statistical summaries as well. If time permits, the future iterations could focus more on derived metrics (cholesterol-to-HDL ratio, for example).

## Conclusion
By transforming a raw dataset into a set of interactive visualizations, I was able to uncover meaningful insights about heart disease patterns. Each visualization provides a window into how different attributes relate to heart health, and together, write a story about the data.
