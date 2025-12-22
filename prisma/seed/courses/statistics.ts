/**
 * Introduction to Statistics - Seed Course Data
 * University-level introductory statistics covering descriptive statistics,
 * probability, inferential statistics, and correlation/regression.
 *
 * Structure: 4 weeks × 5 days × ~4 IPs = ~80 Information Points
 */

import type { SeedCourse } from "../types";

export const statisticsCourse: SeedCourse = {
    title: "Introduction to Statistics",
    description:
        "A comprehensive introduction to statistical thinking, covering descriptive statistics, probability theory, inferential methods, and data relationships.",
    topic: "Statistics",
    modules: [
        // WEEK 1: Descriptive Statistics
        {
            title: "Descriptive Statistics",
            description:
                "Methods for summarizing and describing data through numbers and visualizations.",
            order: 1,
            lessons: [
                {
                    title: "Types of Data",
                    description:
                        "Understanding different types of variables and data.",
                    order: 1,
                    informationPoints: [
                        {
                            title: "Statistics Definition",
                            type: "definition",
                            content:
                                "Statistics is the science of collecting, organizing, analyzing, and interpreting data to make decisions.",
                            order: 1,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Population vs Sample",
                            type: "concept",
                            content:
                                "A population is the entire group of interest; a sample is a subset selected from the population for study.",
                            order: 2,
                            quizTypes: [
                                "binary",
                                "multiple_choice",
                                "question_answer",
                            ],
                        },
                        {
                            title: "Quantitative vs Categorical",
                            type: "concept",
                            content:
                                "Quantitative (numerical) data can be measured; categorical (qualitative) data describes qualities or categories.",
                            order: 3,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Discrete vs Continuous",
                            type: "concept",
                            content:
                                "Discrete data can only take specific values (like counts); continuous data can take any value within a range.",
                            order: 4,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                    ],
                },
                {
                    title: "Measures of Central Tendency",
                    description:
                        "Finding the center or typical value of a dataset.",
                    order: 2,
                    informationPoints: [
                        {
                            title: "Mean",
                            type: "definition",
                            content:
                                "The mean (average) is the sum of all values divided by the number of values.",
                            order: 1,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Median",
                            type: "definition",
                            content:
                                "The median is the middle value when data is sorted; it is resistant to outliers unlike the mean.",
                            order: 2,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Mode",
                            type: "definition",
                            content:
                                "The mode is the most frequently occurring value in a dataset; a dataset can have multiple modes or no mode.",
                            order: 3,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "When to Use Each Measure",
                            type: "concept",
                            content:
                                "Use median for skewed data or outliers; use mean for symmetric data; use mode for categorical data.",
                            order: 4,
                            quizTypes: [
                                "binary",
                                "multiple_choice",
                                "question_answer",
                            ],
                        },
                    ],
                },
                {
                    title: "Measures of Variability",
                    description: "Quantifying the spread of data.",
                    order: 3,
                    informationPoints: [
                        {
                            title: "Range",
                            type: "definition",
                            content:
                                "The range is the difference between the maximum and minimum values in a dataset.",
                            order: 1,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Variance",
                            type: "definition",
                            content:
                                "Variance measures the average squared deviation from the mean, showing how spread out the data is.",
                            order: 2,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Standard Deviation",
                            type: "definition",
                            content:
                                "Standard deviation is the square root of variance, measured in the same units as the original data.",
                            order: 3,
                            quizTypes: [
                                "binary",
                                "multiple_choice",
                                "question_answer",
                            ],
                        },
                        {
                            title: "Interquartile Range",
                            type: "definition",
                            content:
                                "The IQR is the range of the middle 50% of data (Q3 minus Q1), resistant to outliers.",
                            order: 4,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                    ],
                },
                {
                    title: "Data Visualization",
                    description: "Graphical methods for displaying data.",
                    order: 4,
                    informationPoints: [
                        {
                            title: "Histogram",
                            type: "definition",
                            content:
                                "A histogram displays the distribution of quantitative data using bars where height represents frequency.",
                            order: 1,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Box Plot",
                            type: "definition",
                            content:
                                "A box plot displays the five-number summary: minimum, Q1, median, Q3, and maximum, showing data spread and outliers.",
                            order: 2,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Bar Chart vs Histogram",
                            type: "concept",
                            content:
                                "Bar charts display categorical data with gaps between bars; histograms display continuous data with no gaps.",
                            order: 3,
                            quizTypes: [
                                "binary",
                                "multiple_choice",
                                "question_answer",
                            ],
                        },
                        {
                            title: "Scatter Plot",
                            type: "definition",
                            content:
                                "A scatter plot shows the relationship between two quantitative variables by plotting data points on x-y coordinates.",
                            order: 4,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                    ],
                },
                {
                    title: "Distribution Shape",
                    description: "Describing the shape of data distributions.",
                    order: 5,
                    informationPoints: [
                        {
                            title: "Symmetric Distribution",
                            type: "concept",
                            content:
                                "A symmetric distribution has equal tails on both sides; the mean and median are approximately equal.",
                            order: 1,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Skewness",
                            type: "concept",
                            content:
                                "Right-skewed distributions have a long right tail (mean > median); left-skewed have a long left tail (mean < median).",
                            order: 2,
                            quizTypes: [
                                "binary",
                                "multiple_choice",
                                "question_answer",
                            ],
                        },
                        {
                            title: "Outliers",
                            type: "definition",
                            content:
                                "Outliers are data points that fall far from the main pattern; they can significantly affect the mean and standard deviation.",
                            order: 3,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Unimodal vs Bimodal",
                            type: "concept",
                            content:
                                "Unimodal distributions have one peak; bimodal have two peaks, suggesting two distinct groups in the data.",
                            order: 4,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                    ],
                },
            ],
        },

        // WEEK 2: Probability
        {
            title: "Probability",
            description: "The mathematics of uncertainty and random events.",
            order: 2,
            lessons: [
                {
                    title: "Basic Probability",
                    description: "Fundamental concepts of probability theory.",
                    order: 1,
                    informationPoints: [
                        {
                            title: "Probability Definition",
                            type: "definition",
                            content:
                                "Probability is a number between 0 and 1 representing the likelihood of an event occurring.",
                            order: 1,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Sample Space",
                            type: "definition",
                            content:
                                "The sample space is the set of all possible outcomes of an experiment.",
                            order: 2,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Event",
                            type: "definition",
                            content:
                                "An event is a subset of the sample space; the probability of an event is the sum of probabilities of its outcomes.",
                            order: 3,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Complement Rule",
                            type: "concept",
                            content:
                                "The probability that an event does not occur equals 1 minus the probability that it does: P(not A) = 1 - P(A).",
                            order: 4,
                            quizTypes: [
                                "binary",
                                "multiple_choice",
                                "question_answer",
                            ],
                        },
                    ],
                },
                {
                    title: "Probability Rules",
                    description: "Combining probabilities of multiple events.",
                    order: 2,
                    informationPoints: [
                        {
                            title: "Addition Rule",
                            type: "concept",
                            content:
                                "For mutually exclusive events: P(A or B) = P(A) + P(B). For non-exclusive: P(A or B) = P(A) + P(B) - P(A and B).",
                            order: 1,
                            quizTypes: [
                                "binary",
                                "multiple_choice",
                                "question_answer",
                            ],
                        },
                        {
                            title: "Multiplication Rule",
                            type: "concept",
                            content:
                                "For independent events: P(A and B) = P(A) × P(B). For dependent: P(A and B) = P(A) × P(B|A).",
                            order: 2,
                            quizTypes: [
                                "binary",
                                "multiple_choice",
                                "question_answer",
                            ],
                        },
                        {
                            title: "Independent Events",
                            type: "definition",
                            content:
                                "Events are independent if the occurrence of one does not affect the probability of the other.",
                            order: 3,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Conditional Probability",
                            type: "definition",
                            content:
                                "Conditional probability P(A|B) is the probability of A given that B has occurred.",
                            order: 4,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                    ],
                },
                {
                    title: "Random Variables",
                    description: "Variables that take random values.",
                    order: 3,
                    informationPoints: [
                        {
                            title: "Random Variable Definition",
                            type: "definition",
                            content:
                                "A random variable is a variable whose value is determined by the outcome of a random process.",
                            order: 1,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Discrete Random Variable",
                            type: "concept",
                            content:
                                "A discrete random variable has countable possible values, each with an associated probability.",
                            order: 2,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Continuous Random Variable",
                            type: "concept",
                            content:
                                "A continuous random variable can take any value in an interval; probabilities are defined over ranges, not single points.",
                            order: 3,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Expected Value",
                            type: "definition",
                            content:
                                "The expected value (mean) of a random variable is the weighted average of all possible values, weighted by their probabilities.",
                            order: 4,
                            quizTypes: [
                                "binary",
                                "multiple_choice",
                                "question_answer",
                            ],
                        },
                    ],
                },
                {
                    title: "The Normal Distribution",
                    description:
                        "The most important probability distribution in statistics.",
                    order: 4,
                    informationPoints: [
                        {
                            title: "Normal Distribution Definition",
                            type: "definition",
                            content:
                                "The normal distribution is a symmetric, bell-shaped distribution defined by its mean (μ) and standard deviation (σ).",
                            order: 1,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "68-95-99.7 Rule",
                            type: "concept",
                            content:
                                "In a normal distribution, approximately 68% of data falls within 1 SD, 95% within 2 SDs, and 99.7% within 3 SDs of the mean.",
                            order: 2,
                            quizTypes: [
                                "binary",
                                "multiple_choice",
                                "question_answer",
                            ],
                        },
                        {
                            title: "Standard Normal Distribution",
                            type: "definition",
                            content:
                                "The standard normal distribution has mean 0 and standard deviation 1; any normal distribution can be converted to it using z-scores.",
                            order: 3,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Z-Score",
                            type: "definition",
                            content:
                                "A z-score indicates how many standard deviations a value is from the mean: z = (x - μ) / σ.",
                            order: 4,
                            quizTypes: [
                                "binary",
                                "multiple_choice",
                                "question_answer",
                            ],
                        },
                    ],
                },
                {
                    title: "Sampling Distributions",
                    description: "The behavior of sample statistics.",
                    order: 5,
                    informationPoints: [
                        {
                            title: "Sampling Distribution Definition",
                            type: "definition",
                            content:
                                "A sampling distribution shows the distribution of a statistic (like the mean) calculated from many random samples.",
                            order: 1,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Central Limit Theorem",
                            type: "concept",
                            content:
                                "The Central Limit Theorem states that sample means are approximately normally distributed for large samples, regardless of population shape.",
                            order: 2,
                            quizTypes: [
                                "binary",
                                "multiple_choice",
                                "question_answer",
                            ],
                        },
                        {
                            title: "Standard Error",
                            type: "definition",
                            content:
                                "Standard error is the standard deviation of a sampling distribution; for means, SE = σ/√n.",
                            order: 3,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Law of Large Numbers",
                            type: "concept",
                            content:
                                "As sample size increases, the sample mean gets closer to the population mean.",
                            order: 4,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                    ],
                },
            ],
        },

        // WEEK 3: Inferential Statistics
        {
            title: "Inferential Statistics",
            description:
                "Drawing conclusions about populations from sample data.",
            order: 3,
            lessons: [
                {
                    title: "Confidence Intervals",
                    description:
                        "Estimating population parameters with uncertainty.",
                    order: 1,
                    informationPoints: [
                        {
                            title: "Point Estimate",
                            type: "definition",
                            content:
                                "A point estimate is a single value used to estimate a population parameter, such as using the sample mean to estimate the population mean.",
                            order: 1,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Confidence Interval Definition",
                            type: "definition",
                            content:
                                "A confidence interval is a range of values that likely contains the true population parameter.",
                            order: 2,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Confidence Level",
                            type: "concept",
                            content:
                                "A 95% confidence level means that 95% of similarly constructed intervals would contain the true parameter.",
                            order: 3,
                            quizTypes: [
                                "binary",
                                "multiple_choice",
                                "question_answer",
                            ],
                        },
                        {
                            title: "Margin of Error",
                            type: "definition",
                            content:
                                "Margin of error is the distance from the point estimate to the confidence interval boundaries; larger samples give smaller margins.",
                            order: 4,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                    ],
                },
                {
                    title: "Hypothesis Testing Basics",
                    description:
                        "The logic and structure of statistical hypothesis tests.",
                    order: 2,
                    informationPoints: [
                        {
                            title: "Null Hypothesis",
                            type: "definition",
                            content:
                                "The null hypothesis (H₀) is the default claim we assume to be true, typically stating no effect or no difference.",
                            order: 1,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Alternative Hypothesis",
                            type: "definition",
                            content:
                                "The alternative hypothesis (H₁ or Hₐ) is what we're trying to find evidence for; it contradicts the null.",
                            order: 2,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "P-Value",
                            type: "definition",
                            content:
                                "The p-value is the probability of observing results as extreme as the data, assuming the null hypothesis is true.",
                            order: 3,
                            quizTypes: [
                                "binary",
                                "multiple_choice",
                                "question_answer",
                            ],
                        },
                        {
                            title: "Significance Level",
                            type: "definition",
                            content:
                                "The significance level (α, typically 0.05) is the threshold below which we reject the null hypothesis.",
                            order: 4,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                    ],
                },
                {
                    title: "Types of Errors",
                    description:
                        "Understanding mistakes in hypothesis testing.",
                    order: 3,
                    informationPoints: [
                        {
                            title: "Type I Error",
                            type: "definition",
                            content:
                                "A Type I error (false positive) occurs when we reject a true null hypothesis; its probability equals α.",
                            order: 1,
                            quizTypes: [
                                "binary",
                                "multiple_choice",
                                "question_answer",
                            ],
                        },
                        {
                            title: "Type II Error",
                            type: "definition",
                            content:
                                "A Type II error (false negative) occurs when we fail to reject a false null hypothesis; its probability is denoted β.",
                            order: 2,
                            quizTypes: [
                                "binary",
                                "multiple_choice",
                                "question_answer",
                            ],
                        },
                        {
                            title: "Statistical Power",
                            type: "definition",
                            content:
                                "Power (1 - β) is the probability of correctly rejecting a false null hypothesis; higher power is better.",
                            order: 3,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Trade-off Between Errors",
                            type: "concept",
                            content:
                                "Decreasing α (Type I error rate) increases β (Type II error rate); we balance these based on consequences of each error type.",
                            order: 4,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                    ],
                },
                {
                    title: "T-Tests",
                    description: "Comparing means using the t-distribution.",
                    order: 4,
                    informationPoints: [
                        {
                            title: "T-Distribution",
                            type: "concept",
                            content:
                                "The t-distribution is similar to the normal but with heavier tails; it's used when sample size is small or population SD is unknown.",
                            order: 1,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "One-Sample T-Test",
                            type: "definition",
                            content:
                                "A one-sample t-test compares a sample mean to a hypothesized population mean.",
                            order: 2,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Two-Sample T-Test",
                            type: "definition",
                            content:
                                "A two-sample t-test compares the means of two independent groups to determine if they differ significantly.",
                            order: 3,
                            quizTypes: [
                                "binary",
                                "multiple_choice",
                                "question_answer",
                            ],
                        },
                        {
                            title: "Paired T-Test",
                            type: "definition",
                            content:
                                "A paired t-test compares two related measurements from the same subjects (like before and after treatment).",
                            order: 4,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                    ],
                },
                {
                    title: "Statistical Significance",
                    description:
                        "Interpreting and reporting hypothesis test results.",
                    order: 5,
                    informationPoints: [
                        {
                            title: "Statistical vs Practical Significance",
                            type: "concept",
                            content:
                                "Statistical significance means an effect is unlikely due to chance; practical significance means the effect is large enough to matter.",
                            order: 1,
                            quizTypes: [
                                "binary",
                                "multiple_choice",
                                "question_answer",
                            ],
                        },
                        {
                            title: "Effect Size",
                            type: "definition",
                            content:
                                "Effect size measures the magnitude of a difference or relationship, independent of sample size.",
                            order: 2,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Cohen's d",
                            type: "definition",
                            content:
                                "Cohen's d measures effect size as the difference between means divided by standard deviation; 0.2 is small, 0.5 medium, 0.8 large.",
                            order: 3,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "P-Hacking Warning",
                            type: "concept",
                            content:
                                "P-hacking is manipulating analysis to achieve significance; it inflates false positive rates and produces unreliable results.",
                            order: 4,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                    ],
                },
            ],
        },

        // WEEK 4: Relationships Between Variables
        {
            title: "Relationships Between Variables",
            description:
                "Analyzing associations and making predictions from data.",
            order: 4,
            lessons: [
                {
                    title: "Correlation",
                    description:
                        "Measuring the strength of linear relationships.",
                    order: 1,
                    informationPoints: [
                        {
                            title: "Correlation Definition",
                            type: "definition",
                            content:
                                "Correlation measures the strength and direction of the linear relationship between two quantitative variables.",
                            order: 1,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Correlation Coefficient",
                            type: "concept",
                            content:
                                "The correlation coefficient (r) ranges from -1 to +1; closer to ±1 means stronger linear relationship, 0 means no linear relationship.",
                            order: 2,
                            quizTypes: [
                                "binary",
                                "multiple_choice",
                                "question_answer",
                            ],
                        },
                        {
                            title: "Positive vs Negative Correlation",
                            type: "concept",
                            content:
                                "Positive correlation: as X increases, Y increases. Negative correlation: as X increases, Y decreases.",
                            order: 3,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Correlation ≠ Causation",
                            type: "concept",
                            content:
                                "Correlation does not imply causation; a third variable or coincidence may explain the relationship.",
                            order: 4,
                            quizTypes: [
                                "binary",
                                "multiple_choice",
                                "question_answer",
                            ],
                        },
                    ],
                },
                {
                    title: "Linear Regression",
                    description: "Predicting one variable from another.",
                    order: 2,
                    informationPoints: [
                        {
                            title: "Linear Regression Definition",
                            type: "definition",
                            content:
                                "Linear regression finds the best-fitting straight line to predict a response variable from an explanatory variable.",
                            order: 1,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Regression Equation",
                            type: "concept",
                            content:
                                "The regression equation is ŷ = a + bx, where a is the y-intercept and b is the slope.",
                            order: 2,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Slope Interpretation",
                            type: "concept",
                            content:
                                "The slope (b) represents the predicted change in Y for a one-unit increase in X.",
                            order: 3,
                            quizTypes: [
                                "binary",
                                "multiple_choice",
                                "question_answer",
                            ],
                        },
                        {
                            title: "Least Squares Method",
                            type: "concept",
                            content:
                                "The least squares method finds the line that minimizes the sum of squared vertical distances between points and the line.",
                            order: 4,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                    ],
                },
                {
                    title: "Regression Analysis",
                    description:
                        "Evaluating and interpreting regression models.",
                    order: 3,
                    informationPoints: [
                        {
                            title: "R-Squared",
                            type: "definition",
                            content:
                                "R² (coefficient of determination) is the proportion of variance in Y explained by X; ranges from 0 to 1.",
                            order: 1,
                            quizTypes: [
                                "binary",
                                "multiple_choice",
                                "question_answer",
                            ],
                        },
                        {
                            title: "Residuals",
                            type: "definition",
                            content:
                                "A residual is the difference between an observed value and the predicted value: residual = y - ŷ.",
                            order: 2,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Extrapolation Warning",
                            type: "concept",
                            content:
                                "Extrapolation (predicting beyond the range of data) is risky because the linear relationship may not hold outside observed values.",
                            order: 3,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Influential Points",
                            type: "concept",
                            content:
                                "Influential points (especially outliers with extreme X values) can dramatically change the regression line and should be investigated.",
                            order: 4,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                    ],
                },
                {
                    title: "Chi-Square Tests",
                    description: "Analyzing categorical data relationships.",
                    order: 4,
                    informationPoints: [
                        {
                            title: "Chi-Square Test Definition",
                            type: "definition",
                            content:
                                "The chi-square test compares observed frequencies to expected frequencies to test for associations between categorical variables.",
                            order: 1,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Contingency Table",
                            type: "definition",
                            content:
                                "A contingency table displays the frequencies of two categorical variables, with rows for one variable and columns for another.",
                            order: 2,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Expected Frequency",
                            type: "concept",
                            content:
                                "Expected frequency is what we'd expect in each cell if the variables were independent: (row total × column total) / grand total.",
                            order: 3,
                            quizTypes: [
                                "binary",
                                "multiple_choice",
                                "question_answer",
                            ],
                        },
                        {
                            title: "Chi-Square Statistic",
                            type: "concept",
                            content:
                                "The chi-square statistic measures how much observed frequencies differ from expected; larger values indicate stronger evidence against independence.",
                            order: 4,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                    ],
                },
                {
                    title: "Statistical Thinking",
                    description: "Principles for sound statistical reasoning.",
                    order: 5,
                    informationPoints: [
                        {
                            title: "Confounding Variables",
                            type: "definition",
                            content:
                                "A confounding variable is related to both the explanatory and response variables, potentially creating a spurious association.",
                            order: 1,
                            quizTypes: [
                                "binary",
                                "multiple_choice",
                                "question_answer",
                            ],
                        },
                        {
                            title: "Simpson's Paradox",
                            type: "concept",
                            content:
                                "Simpson's paradox occurs when a trend appears in subgroups but reverses when groups are combined, due to a lurking variable.",
                            order: 2,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Random Sampling Importance",
                            type: "concept",
                            content:
                                "Random sampling is essential for generalizability; biased samples lead to incorrect conclusions about the population.",
                            order: 3,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Replication",
                            type: "concept",
                            content:
                                "Replication—repeating studies to verify results—is crucial for scientific credibility; single studies can produce false positives.",
                            order: 4,
                            quizTypes: [
                                "binary",
                                "multiple_choice",
                                "question_answer",
                            ],
                        },
                    ],
                },
            ],
        },
    ],
};
