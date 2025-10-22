# Data Visualization Project

## Data

The data I propose to visualize for my project is a UCI Heart Disease Dataset. It is composed of 14 attributes which are age, sex, chest pain type, resting blood pressure, serum cholesterol, fasting blood sugar, resting electrocardiographic results, maximum heart rate achieved, exercise-induced angina, oldpeak — ST depression induced by exercise relative to rest, the slope of the peak exercise ST segment, number of major vessels and Thalassemia.
https://www.kaggle.com/datasets/redwankarimsony/heart-disease-data


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
<img width="957" height="498" alt="image" src="https://github.com/user-attachments/assets/1dda6915-39b6-4247-a30b-57ceead55a28" />
<iframe src="https://vizhub.com/sarayuv/b5de266a3453438a9058b5770a11f517?mode=embed&embed=branded" width="960" height="500" scrolling="no" frameborder="no"></iframe>
This scatterplot shows the relationship between resting blood pressure and cholesterol, with points colored by heart disease presence or absence. The latest additions to this visualization are tooltips and an interactive color legend.

Heart Disease Presence by Chest Pain Type
<img width="850" height="425" alt="image" src="https://github.com/user-attachments/assets/5be12a63-f45b-4b0b-a014-bdb3423b766a" />
<iframe src="https://vizhub.com/sarayuv/705431824c0c408784f00494e2683380?mode=embed&embed=branded" width="960" height="500" scrolling="no" frameborder="no"></iframe>
This bar plot shows the relationship between chest pain type and heart disease presence. It uses stacked bars to represent the percentage of people with and without heart disease for each chest pain type.

Age by Heart Disease Status
<img width="962" height="503" alt="image" src="https://github.com/user-attachments/assets/92c4c9e6-df58-4bbe-adb7-710657afaa83" />
<iframe src="https://vizhub.com/sarayuv/705431824c0c408784f00494e2683380?mode=embed&embed=branded" width="960" height="500" scrolling="no" frameborder="no"></iframe>
This histogram shows the age distribution of individuals with and without heart disease. The visualization shows that the likelihood of heart disease increases significantly in middle-aged and older adults.



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
