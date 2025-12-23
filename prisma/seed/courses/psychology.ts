/**
 * Introduction to Psychology - Seed Course Data
 * University-level introductory psychology covering foundations, biological bases,
 * learning & memory, and social/clinical psychology.
 *
 * Structure: 4 weeks × 5 days × ~4 IPs = ~80 Information Points
 */

import type { SeedCourse } from "../types";

export const psychologyCourse: SeedCourse = {
    title: "Introduction to Psychology",
    description:
        "A comprehensive introduction to the scientific study of mind and behavior, covering research methods, biological foundations, cognition, and social influences.",
    topic: "Psychology",
    imageId: "photo-1507413245164-6160d8298b31",
    modules: [
        // WEEK 1: Foundations of Psychology
        {
            title: "Foundations of Psychology",
            description:
                "The history, methods, and ethical foundations of psychological science.",
            order: 1,
            lessons: [
                {
                    title: "What is Psychology?",
                    description:
                        "Defining psychology and understanding its scope as a science.",
                    order: 1,
                    informationPoints: [
                        {
                            title: "Definition of Psychology",
                            type: "definition",
                            content:
                                "Psychology is the scientific study of behavior and mental processes.",
                            order: 1,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Behavior vs Mental Processes",
                            type: "concept",
                            content:
                                "Behavior refers to observable actions, while mental processes include thoughts, feelings, and perceptions that cannot be directly observed.",
                            order: 2,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Psychology as a Science",
                            type: "concept",
                            content:
                                "Psychology uses systematic observation, measurement, and experimentation to study the mind, distinguishing it from philosophy or common sense.",
                            order: 3,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Goals of Psychology",
                            type: "concept",
                            content:
                                "The four main goals of psychology are to describe, explain, predict, and control behavior and mental processes.",
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
                    title: "History of Psychology",
                    description:
                        "The emergence of psychology as a distinct scientific discipline.",
                    order: 2,
                    informationPoints: [
                        {
                            title: "Wilhelm Wundt",
                            type: "definition",
                            content:
                                "Wilhelm Wundt established the first psychology laboratory in Leipzig, Germany in 1879, marking the birth of psychology as an independent science.",
                            order: 1,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Structuralism",
                            type: "concept",
                            content:
                                "Structuralism, led by Edward Titchener, aimed to identify the basic elements of consciousness through introspection.",
                            order: 2,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Functionalism",
                            type: "concept",
                            content:
                                "Functionalism, pioneered by William James, focused on how mental processes help organisms adapt to their environment rather than their structure.",
                            order: 3,
                            quizTypes: [
                                "binary",
                                "multiple_choice",
                                "question_answer",
                            ],
                        },
                        {
                            title: "Psychoanalysis",
                            type: "concept",
                            content:
                                "Sigmund Freud developed psychoanalysis, emphasizing unconscious drives and early childhood experiences as determinants of behavior.",
                            order: 4,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                    ],
                },
                {
                    title: "Modern Perspectives",
                    description:
                        "Contemporary approaches to understanding psychology.",
                    order: 3,
                    informationPoints: [
                        {
                            title: "Behavioral Perspective",
                            type: "concept",
                            content:
                                "The behavioral perspective focuses on observable behavior and how it is learned through conditioning, rejecting the study of mental processes.",
                            order: 1,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Cognitive Perspective",
                            type: "concept",
                            content:
                                "The cognitive perspective studies mental processes like thinking, memory, and problem-solving, viewing the mind as an information processor.",
                            order: 2,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Biological Perspective",
                            type: "concept",
                            content:
                                "The biological perspective examines how genetics, brain structures, and neurochemistry influence behavior and mental processes.",
                            order: 3,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Humanistic Perspective",
                            type: "concept",
                            content:
                                "The humanistic perspective emphasizes free will, personal growth, and the drive toward self-actualization.",
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
                    title: "Research Methods",
                    description:
                        "Scientific approaches to studying psychology.",
                    order: 4,
                    informationPoints: [
                        {
                            title: "Scientific Method",
                            type: "procedure",
                            content:
                                "Psychologists use the scientific method: observe, form hypothesis, test through experimentation, analyze data, and draw conclusions.",
                            order: 1,
                            quizTypes: [
                                "binary",
                                "multiple_choice",
                                "question_answer",
                            ],
                        },
                        {
                            title: "Experimental Method",
                            type: "concept",
                            content:
                                "Experiments manipulate an independent variable to measure its effect on a dependent variable while controlling other factors.",
                            order: 2,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Correlation vs Causation",
                            type: "concept",
                            content:
                                "Correlation indicates that two variables are related, but it does not prove that one causes the other.",
                            order: 3,
                            quizTypes: [
                                "binary",
                                "multiple_choice",
                                "question_answer",
                            ],
                        },
                        {
                            title: "Random Assignment",
                            type: "concept",
                            content:
                                "Random assignment ensures each participant has an equal chance of being in any condition, controlling for confounding variables.",
                            order: 4,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                    ],
                },
                {
                    title: "Ethics in Psychology",
                    description:
                        "Ethical guidelines for psychological research and practice.",
                    order: 5,
                    informationPoints: [
                        {
                            title: "Informed Consent",
                            type: "definition",
                            content:
                                "Informed consent requires researchers to explain the study's purpose, procedures, and risks so participants can voluntarily decide to participate.",
                            order: 1,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Deception in Research",
                            type: "concept",
                            content:
                                "Deception is only permitted when the study cannot be conducted otherwise and participants are debriefed afterward.",
                            order: 2,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Confidentiality",
                            type: "concept",
                            content:
                                "Researchers must protect participants' privacy by keeping their data confidential and anonymous when possible.",
                            order: 3,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Right to Withdraw",
                            type: "concept",
                            content:
                                "Participants have the right to withdraw from a study at any time without penalty.",
                            order: 4,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                    ],
                },
            ],
        },

        // WEEK 2: Biological Psychology
        {
            title: "Biological Bases of Behavior",
            description:
                "The brain, nervous system, and their role in behavior and mental processes.",
            order: 2,
            lessons: [
                {
                    title: "Neurons and Neural Communication",
                    description:
                        "How nerve cells transmit information in the brain.",
                    order: 1,
                    informationPoints: [
                        {
                            title: "Neuron Definition",
                            type: "definition",
                            content:
                                "A neuron is a nerve cell that receives, processes, and transmits information through electrical and chemical signals.",
                            order: 1,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Neuron Structure",
                            type: "concept",
                            content:
                                "Neurons consist of dendrites that receive signals, a cell body that processes them, and an axon that transmits signals to other neurons.",
                            order: 2,
                            quizTypes: [
                                "binary",
                                "multiple_choice",
                                "question_answer",
                            ],
                        },
                        {
                            title: "Action Potential",
                            type: "concept",
                            content:
                                "An action potential is an electrical impulse that travels down the axon when a neuron fires, following an all-or-none principle.",
                            order: 3,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Synapse",
                            type: "definition",
                            content:
                                "The synapse is the gap between neurons where neurotransmitters are released to communicate with the next neuron.",
                            order: 4,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                    ],
                },
                {
                    title: "Neurotransmitters",
                    description: "Chemical messengers in the brain.",
                    order: 2,
                    informationPoints: [
                        {
                            title: "Neurotransmitter Definition",
                            type: "definition",
                            content:
                                "Neurotransmitters are chemical messengers that cross the synapse to transmit signals between neurons.",
                            order: 1,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Dopamine",
                            type: "concept",
                            content:
                                "Dopamine is involved in reward, motivation, and movement; its dysfunction is linked to Parkinson's disease and addiction.",
                            order: 2,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Serotonin",
                            type: "concept",
                            content:
                                "Serotonin regulates mood, sleep, and appetite; low levels are associated with depression.",
                            order: 3,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "GABA and Glutamate",
                            type: "concept",
                            content:
                                "GABA is the main inhibitory neurotransmitter that calms neural activity, while glutamate is the main excitatory neurotransmitter.",
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
                    title: "Brain Structure",
                    description:
                        "Major regions of the brain and their functions.",
                    order: 3,
                    informationPoints: [
                        {
                            title: "Cerebral Cortex",
                            type: "definition",
                            content:
                                "The cerebral cortex is the brain's outer layer responsible for higher cognitive functions including thinking, planning, and language.",
                            order: 1,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Brain Lobes",
                            type: "concept",
                            content:
                                "The brain has four lobes: frontal (reasoning), parietal (sensation), temporal (hearing/memory), and occipital (vision).",
                            order: 2,
                            quizTypes: [
                                "binary",
                                "multiple_choice",
                                "question_answer",
                            ],
                        },
                        {
                            title: "Limbic System",
                            type: "concept",
                            content:
                                "The limbic system, including the amygdala and hippocampus, controls emotions and memory formation.",
                            order: 3,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Brain Stem",
                            type: "concept",
                            content:
                                "The brain stem controls basic survival functions like breathing, heart rate, and sleep-wake cycles.",
                            order: 4,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                    ],
                },
                {
                    title: "Sensation",
                    description:
                        "How sensory receptors detect and encode stimuli.",
                    order: 4,
                    informationPoints: [
                        {
                            title: "Sensation Definition",
                            type: "definition",
                            content:
                                "Sensation is the process by which sensory receptors detect physical energy from the environment and convert it into neural signals.",
                            order: 1,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Transduction",
                            type: "concept",
                            content:
                                "Transduction is the conversion of physical energy (light, sound waves) into neural impulses that the brain can interpret.",
                            order: 2,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Absolute Threshold",
                            type: "definition",
                            content:
                                "The absolute threshold is the minimum amount of stimulation needed to detect a stimulus 50% of the time.",
                            order: 3,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Difference Threshold",
                            type: "definition",
                            content:
                                "The difference threshold (just noticeable difference) is the minimum change in stimulation needed to detect a difference.",
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
                    title: "Perception",
                    description:
                        "How the brain organizes and interprets sensory information.",
                    order: 5,
                    informationPoints: [
                        {
                            title: "Perception Definition",
                            type: "definition",
                            content:
                                "Perception is the process of organizing and interpreting sensory information to give it meaning.",
                            order: 1,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Bottom-Up Processing",
                            type: "concept",
                            content:
                                "Bottom-up processing builds perception from sensory input, starting with raw data and constructing meaning from details.",
                            order: 2,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Top-Down Processing",
                            type: "concept",
                            content:
                                "Top-down processing uses existing knowledge, expectations, and context to interpret sensory information.",
                            order: 3,
                            quizTypes: [
                                "binary",
                                "multiple_choice",
                                "question_answer",
                            ],
                        },
                        {
                            title: "Gestalt Principles",
                            type: "concept",
                            content:
                                "Gestalt principles describe how we group visual elements, including proximity, similarity, and closure.",
                            order: 4,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                    ],
                },
            ],
        },

        // WEEK 3: Learning and Memory
        {
            title: "Learning and Memory",
            description:
                "How we acquire new behaviors and store information over time.",
            order: 3,
            lessons: [
                {
                    title: "Classical Conditioning",
                    description: "Learning through association.",
                    order: 1,
                    informationPoints: [
                        {
                            title: "Classical Conditioning Definition",
                            type: "definition",
                            content:
                                "Classical conditioning is learning in which a neutral stimulus becomes associated with a meaningful stimulus, eventually triggering a similar response.",
                            order: 1,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Pavlov's Experiment",
                            type: "example",
                            content:
                                "Pavlov conditioned dogs to salivate at the sound of a bell by repeatedly pairing the bell with food.",
                            order: 2,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Conditioned and Unconditioned Stimuli",
                            type: "concept",
                            content:
                                "The unconditioned stimulus (food) naturally triggers a response, while the conditioned stimulus (bell) only triggers a response after learning.",
                            order: 3,
                            quizTypes: [
                                "binary",
                                "multiple_choice",
                                "question_answer",
                            ],
                        },
                        {
                            title: "Extinction",
                            type: "concept",
                            content:
                                "Extinction occurs when the conditioned stimulus is presented repeatedly without the unconditioned stimulus, weakening the learned response.",
                            order: 4,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                    ],
                },
                {
                    title: "Operant Conditioning",
                    description: "Learning through consequences.",
                    order: 2,
                    informationPoints: [
                        {
                            title: "Operant Conditioning Definition",
                            type: "definition",
                            content:
                                "Operant conditioning is learning in which behavior is strengthened or weakened by its consequences (reinforcement or punishment).",
                            order: 1,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Reinforcement",
                            type: "concept",
                            content:
                                "Reinforcement increases the likelihood of a behavior; positive reinforcement adds something desirable, negative reinforcement removes something aversive.",
                            order: 2,
                            quizTypes: [
                                "binary",
                                "multiple_choice",
                                "question_answer",
                            ],
                        },
                        {
                            title: "Punishment",
                            type: "concept",
                            content:
                                "Punishment decreases the likelihood of a behavior; positive punishment adds something aversive, negative punishment removes something desirable.",
                            order: 3,
                            quizTypes: [
                                "binary",
                                "multiple_choice",
                                "question_answer",
                            ],
                        },
                        {
                            title: "Skinner Box",
                            type: "example",
                            content:
                                "B.F. Skinner studied operant conditioning using a chamber where animals learned to press levers for food rewards.",
                            order: 4,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                    ],
                },
                {
                    title: "Observational Learning",
                    description: "Learning by watching others.",
                    order: 3,
                    informationPoints: [
                        {
                            title: "Observational Learning Definition",
                            type: "definition",
                            content:
                                "Observational learning occurs when we learn new behaviors by watching and imitating others (models).",
                            order: 1,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Bobo Doll Experiment",
                            type: "example",
                            content:
                                "Bandura's Bobo doll experiment showed that children who watched adults act aggressively toward a doll were more likely to imitate that aggression.",
                            order: 2,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Mirror Neurons",
                            type: "concept",
                            content:
                                "Mirror neurons fire both when performing an action and when observing someone else perform that action, potentially underlying imitation.",
                            order: 3,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Vicarious Reinforcement",
                            type: "concept",
                            content:
                                "Vicarious reinforcement occurs when we are more likely to imitate a behavior if we observe the model being rewarded for it.",
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
                    title: "Memory Encoding and Storage",
                    description: "How memories are formed and maintained.",
                    order: 4,
                    informationPoints: [
                        {
                            title: "Encoding",
                            type: "definition",
                            content:
                                "Encoding is the process of converting sensory information into a form that can be stored in memory.",
                            order: 1,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Sensory Memory",
                            type: "concept",
                            content:
                                "Sensory memory holds incoming sensory information for a fraction of a second before it is either forgotten or transferred to short-term memory.",
                            order: 2,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Short-Term Memory",
                            type: "concept",
                            content:
                                "Short-term memory holds about 7 items for approximately 20-30 seconds unless rehearsed.",
                            order: 3,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Long-Term Memory",
                            type: "concept",
                            content:
                                "Long-term memory has virtually unlimited capacity and can store information for a lifetime through consolidation.",
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
                    title: "Memory Retrieval and Forgetting",
                    description:
                        "How we access memories and why we sometimes fail.",
                    order: 5,
                    informationPoints: [
                        {
                            title: "Retrieval",
                            type: "definition",
                            content:
                                "Retrieval is the process of accessing stored information from memory.",
                            order: 1,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Retrieval Cues",
                            type: "concept",
                            content:
                                "Retrieval cues are stimuli that help trigger the recall of stored information, like contexts, emotions, or related concepts.",
                            order: 2,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Forgetting Curve",
                            type: "concept",
                            content:
                                "Ebbinghaus's forgetting curve shows that memory declines rapidly at first, then levels off—most forgetting happens within the first hour.",
                            order: 3,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Interference",
                            type: "concept",
                            content:
                                "Interference occurs when other information disrupts retrieval; proactive interference is old memories blocking new, retroactive is new blocking old.",
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

        // WEEK 4: Social and Clinical Psychology
        {
            title: "Social and Clinical Psychology",
            description:
                "How we think about and interact with others, and understanding psychological disorders.",
            order: 4,
            lessons: [
                {
                    title: "Social Cognition",
                    description: "How we think about ourselves and others.",
                    order: 1,
                    informationPoints: [
                        {
                            title: "Attribution",
                            type: "definition",
                            content:
                                "Attribution is the process of explaining the causes of behavior, either as internal (dispositional) or external (situational) factors.",
                            order: 1,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Fundamental Attribution Error",
                            type: "concept",
                            content:
                                "The fundamental attribution error is the tendency to overestimate dispositional factors and underestimate situational factors when explaining others' behavior.",
                            order: 2,
                            quizTypes: [
                                "binary",
                                "multiple_choice",
                                "question_answer",
                            ],
                        },
                        {
                            title: "Self-Serving Bias",
                            type: "concept",
                            content:
                                "Self-serving bias is the tendency to attribute our successes to internal factors and our failures to external factors.",
                            order: 3,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Cognitive Dissonance",
                            type: "concept",
                            content:
                                "Cognitive dissonance is the discomfort we feel when our actions conflict with our beliefs, motivating us to change one or the other.",
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
                    title: "Social Influence",
                    description:
                        "How others affect our thoughts and behaviors.",
                    order: 2,
                    informationPoints: [
                        {
                            title: "Conformity",
                            type: "definition",
                            content:
                                "Conformity is adjusting our behavior or thinking to match a group standard.",
                            order: 1,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Asch Conformity Study",
                            type: "example",
                            content:
                                "Asch's line study showed that people often conform to obviously wrong group answers, with about 75% conforming at least once.",
                            order: 2,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Obedience",
                            type: "concept",
                            content:
                                "Obedience is compliance with commands from an authority figure, as demonstrated in Milgram's shock experiments where 65% delivered maximum shocks.",
                            order: 3,
                            quizTypes: [
                                "binary",
                                "multiple_choice",
                                "question_answer",
                            ],
                        },
                        {
                            title: "Groupthink",
                            type: "concept",
                            content:
                                "Groupthink occurs when the desire for group harmony overrides realistic evaluation of alternatives, leading to poor decisions.",
                            order: 4,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                    ],
                },
                {
                    title: "Psychological Disorders",
                    description:
                        "Understanding mental illness and the medical model.",
                    order: 3,
                    informationPoints: [
                        {
                            title: "Psychological Disorder Definition",
                            type: "definition",
                            content:
                                "A psychological disorder is a pattern of thoughts, feelings, or behaviors that is deviant, distressful, and dysfunctional.",
                            order: 1,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "DSM-5",
                            type: "definition",
                            content:
                                "The DSM-5 (Diagnostic and Statistical Manual) is the standard classification system used to diagnose psychological disorders.",
                            order: 2,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Medical Model",
                            type: "concept",
                            content:
                                "The medical model views psychological disorders as illnesses with biological causes that can be diagnosed, treated, and sometimes cured.",
                            order: 3,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Biopsychosocial Model",
                            type: "concept",
                            content:
                                "The biopsychosocial model explains disorders as resulting from the interaction of biological, psychological, and social-cultural factors.",
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
                    title: "Common Disorders",
                    description: "Major categories of psychological disorders.",
                    order: 4,
                    informationPoints: [
                        {
                            title: "Anxiety Disorders",
                            type: "concept",
                            content:
                                "Anxiety disorders involve excessive fear and worry; types include generalized anxiety disorder, panic disorder, and phobias.",
                            order: 1,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Major Depressive Disorder",
                            type: "concept",
                            content:
                                "Major depressive disorder involves persistent sadness, loss of interest, and other symptoms lasting at least two weeks.",
                            order: 2,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Schizophrenia",
                            type: "concept",
                            content:
                                "Schizophrenia is characterized by disorganized thinking, hallucinations, delusions, and diminished emotional expression.",
                            order: 3,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "PTSD",
                            type: "concept",
                            content:
                                "Post-traumatic stress disorder involves flashbacks, nightmares, and severe anxiety following exposure to a traumatic event.",
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
                    title: "Treatment Approaches",
                    description:
                        "Methods for treating psychological disorders.",
                    order: 5,
                    informationPoints: [
                        {
                            title: "Psychotherapy",
                            type: "definition",
                            content:
                                "Psychotherapy is treatment involving psychological techniques to help people overcome problems and change maladaptive behaviors.",
                            order: 1,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Cognitive-Behavioral Therapy",
                            type: "concept",
                            content:
                                "CBT combines cognitive therapy (changing negative thoughts) with behavioral techniques to treat disorders like depression and anxiety.",
                            order: 2,
                            quizTypes: [
                                "binary",
                                "multiple_choice",
                                "question_answer",
                            ],
                        },
                        {
                            title: "Drug Therapy",
                            type: "concept",
                            content:
                                "Drug therapy uses medications like antidepressants, antianxiety drugs, and antipsychotics to alter brain chemistry and reduce symptoms.",
                            order: 3,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Eclectic Approach",
                            type: "concept",
                            content:
                                "Most therapists use an eclectic approach, combining techniques from different therapies based on what works best for each client.",
                            order: 4,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                    ],
                },
            ],
        },
    ],
};
