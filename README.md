# Data Visualization Project

## Data

The data I propose to visualize for my project is a UCI Heart Disease Dataset. It is composed of 14 attributes which are age, sex, chest pain type, resting blood pressure, serum cholesterol, fasting blood sugar, resting electrocardiographic results, maximum heart rate achieved, exercise-induced angina, oldpeak — ST depression induced by exercise relative to rest, the slope of the peak exercise ST segment, number of major vessels and Thalassemia.
[https://www.kaggle.com/datasets/redwankarimsony/heart-disease-data
](https://www.kaggle.com/datasets/redwankarimsony/heart-disease-data
)

## Questions & Tasks

The following tasks and questions will drive the visualization and interaction decisions for this project:

 * How does age distribution differ between people with and without heart disease?
 * What chest pain types are more closely associated with heart disease?
 * What is the relationship between cholesterol and resting blood pressure, and how do they relate to heart disease?
 * Which features of the dataset are strongly correlated?

## Sketches

(insert one or more hand-drawn sketches of interactive visualizations that you imagine)
(describe each sketch - how is the data visualized, what are the interactions, and how do these relate to the questions/tasks)
<img width="2244" height="2904" alt="image" src="https://github.com/user-attachments/assets/30dd4812-25eb-4093-a8ce-10787e7088ca" />


## Prototypes

I’ve created a proof of concept visualization of this data

Resting Blood Pressure vs Cholesterol
<img width="829" height="432" alt="image" src="https://github.com/user-attachments/assets/35135eba-a53b-441f-81b5-66e4d7d6ec9a" />
[https://vizhub.com/sarayuv/b5de266a3453438a9058b5770a11f517
](https://vizhub.com/sarayuv/b5de266a3453438a9058b5770a11f517
)This scatterplot shows the relationship between resting blood pressure and cholesterol, with points colored by heart disease presence or absence. The latest additions to this visualization are tooltips, an interactive color legend, and an improved color scheme. 

Heart Disease Presence by Chest Pain Type
<img width="829" height="432" alt="image" src="https://github.com/user-attachments/assets/f907c96a-28e8-4b57-bcac-cc24f9bd2e9c" />
[https://vizhub.com/sarayuv/c5a9aa4975e34d81afb760c862151e24
](https://vizhub.com/sarayuv/c5a9aa4975e34d81afb760c862151e24)
This bar plot shows the relationship between chest pain type and heart disease presence. It uses stacked bars to represent the percentage of people with and without heart disease for each chest pain type. The latest edits to this visualization include interactions with the stacked bars and color legend.

Age by Heart Disease Status
<img width="829" height="432" alt="image" src="https://github.com/user-attachments/assets/d860f326-75c4-406e-bb45-6d16715c993d" />
[https://vizhub.com/sarayuv/1b729155a7f74a8e9510f8ec31a6e168
](https://vizhub.com/sarayuv/1b729155a7f74a8e9510f8ec31a6e168))
This histogram shows the age distribution of individuals with and without heart disease. The visualization shows that the likelihood of heart disease increases significantly in middle-aged and older adults. The latest additions to this visualization include interactions with the bars and color legend.

Correlation Heatmap Matrix
<img width="829" height="432" alt="image" src="https://github.com/user-attachments/assets/8731b1af-a796-4b76-9ecc-0d2ae90ef346" />
[https://vizhub.com/sarayuv/0827c5cbfd9e4d6d9ffe6df253e5f7ab
](https://vizhub.com/sarayuv/0827c5cbfd9e4d6d9ffe6df253e5f7ab)
This visualization shows the correlation matrix for numeric variables in the dataset. Each cell represents the correlation coefficient between two variables, with:
- Red colors indicating negative correlation
- Blue colors indicating positive correlation
- White indicating no correlation (value near 0)
It also has hover tooltips showing correlation values and descriptions to make it easier for the viewer to understand if it is a strong or weak correlation.

### 11/4/25 Update
After creating a new heatmap correlation matrix, I have been working on unifying the color schemes and axes labels across all visualizations.

## Open Questions

Looking at the first scatterplot prototype, it is unclear whether this information is very useful. It's hard to get any concrete observations from the visualization.
I have started to incorporate interactive color legends and tooltips to my visualizations. I wonder what the best information is to highlight in the tooltips to ensure that the visualization is helpful and informational.

## Milestones

**September**
* visualization 1
  
**October**
* visualization 2 and 3
  
**November**
* visualization 4 and writeups
  
**December**
* finalize portfolio
