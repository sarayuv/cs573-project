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

I’ve created a proof of concept visualization of this data.

### 1. Resting Blood Pressure vs. Cholesterol
**Version 1:**

[![Resting Blood Pressure vs. Cholesterol V1](https://github.com/user-attachments/assets/996ae33f-763f-4841-8dc8-225905eed547)](https://vizhub.com/sarayuv/986f81f68f3d47a289f6e5f5c8e07f7c)

**Version 2:**

[![Resting Blood Pressure vs. Cholesterol V2](https://github.com/user-attachments/assets/3ae2b740-2ae3-4694-ba93-4acacf12195a)](https://vizhub.com/sarayuv/b5de266a3453438a9058b5770a11f517)

**Version 3:**

<![Resting Blood Pressure vs. Cholesterol V3](https://github.com/user-attachments/assets/7c5b097b-e31b-47a9-b317-e3fded4c8ee3)](https://vizhub.com/sarayuv/53bf02533eae4471a39610d7bf267b0f)

**Version 4:**

[![Resting Blood Pressure vs. Cholesterol V4](https://github.com/user-attachments/assets/0a474c3c-961c-4dae-a796-2d261ee5214c)](https://vizhub.com/sarayuv/b7bdb2ee507445cfb195a01522627d01)

This scatterplot explores the relationship between resting blood pressure and cholesterol, with colors indicating heart disease presence.

**Key Features:**
* Tooltips display detailed patient-level information
* Interactive color legend allows users to filter by heart disease status
* Coordinated color scheme for better readability
While there’s some variation, cholesterol and blood pressure don’t show a strong linear relationship with heart disease on their own. This suggests other variables may be stronger predictors

### 2. Heart Disease Presence by Chest Pain Type

**Version 1:**

[![Heart Disease Presence by Chest Pain Type V1](https://github.com/user-attachments/assets/5f065008-cfb4-4b33-a08c-b6d43233c011)](https://vizhub.com/sarayuv/f03873c28b2e40b185152cab723f9690)

**Version 2:**

[![Heart Disease Presence by Chest Pain Type V2](https://github.com/user-attachments/assets/b8c0dd4f-9e7a-4b42-bc28-bae6d925b81e)](https://vizhub.com/sarayuv/c5a9aa4975e34d81afb760c862151e24)

**Version 3:**

[![Heart Disease Presence by Chest Pain Type V3](https://github.com/user-attachments/assets/6d5db715-0b86-4da7-a1c5-411659ea7b48)](https://vizhub.com/sarayuv/2fc6c846c282490f8b3ac7365cd930a0)

This stacked bar chart visualizes the percentage of patients with and without heart disease for each chest pain type.

**Key Features:**

* Stacked bars for visual comparison of proportions
* Interactive hover tooltips showing counts and percentages
* Clickable legend toggles visibility of groups.
Certain chest pain types, particularly those labeled “asymptomatic,” show a much higher rate of heart disease, confirming a strong categorical link.

### 3. Age by Heart Disease Status

**Version 1:**

[![Age by Heart Disease Status V1](https://github.com/user-attachments/assets/f494cea3-5cf8-4f3a-b1e5-b5d260d89782)](https://vizhub.com/sarayuv/705431824c0c408784f00494e2683380)

**Version 2:**

[![Age by Heart Disease Status V2](https://github.com/user-attachments/assets/a6f2b043-99b0-414e-b4b9-616ffaa26f20)](https://vizhub.com/sarayuv/1b729155a7f74a8e9510f8ec31a6e168)

**Version 3:**

[![Age by Heart Disease Status V3](https://github.com/user-attachments/assets/b844c1bd-a3d7-460a-b7f6-ae5170709a14)](https://vizhub.com/sarayuv/6464a597ccdd4adfa8b709f171943b87)

A histogram showing how the likelihood of heart disease changes across age groups.

**Key Features:**

* Overlapping histograms colored by disease status
* Smooth transitions for hover interactions
* Unified color palette consistent with other visualizations.
Heart disease prevalence increases significantly in middle-aged and older adults, as expected, but the visualization also highlights smaller proportions of younger individuals with early-onset cases.

### 4. Correlation Heatmap Matrix

**Version 1:**

[![Correlation Heatmap Matrix V1](https://github.com/user-attachments/assets/dd9f5f07-eccb-48ec-b094-c5d68f5b02c9)](https://vizhub.com/sarayuv/0827c5cbfd9e4d6d9ffe6df253e5f7ab)

**Version 2:**

[![Correlation Heatmap Matrix](https://github.com/user-attachments/assets/508d1cf7-1c11-4186-98b6-283b2cbb9b4b)](https://vizhub.com/sarayuv/8633a5b4e2284fc6a602336b34df3d7b)

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

## 11/18 Update
I have iterated on the correlation matrix heatmap and made it more interactive. I also took into consideration changing some of the bar plots to be percentages instead of frequencies.

## Next Steps
I plan to extend this project further by building an interactive dashboard that combines all four visualization in a single interface. If time permits, the future iterations could focus more on derived metrics (cholesterol-to-HDL ratio, for example).

## Conclusion
By transforming a raw dataset into a set of interactive visualizations, I was able to uncover meaningful insights about heart disease patterns. Each visualization provides a window into how different attributes relate to heart health, and together, write a story about the data.
