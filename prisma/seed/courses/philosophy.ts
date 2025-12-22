/**
 * Introduction to Philosophy - Seed Course Data
 * University-level introductory philosophy covering logic, metaphysics,
 * epistemology, ethics, and philosophy of mind.
 *
 * Structure: 4 weeks × 5 days × ~4 IPs = ~80 Information Points
 */

import type { SeedCourse } from "../types";

export const philosophyCourse: SeedCourse = {
    title: "Introduction to Philosophy",
    description:
        "A rigorous introduction to philosophical thinking, covering logic, metaphysics, epistemology, ethics, and contemporary issues in philosophy of mind.",
    topic: "Philosophy",
    modules: [
        // WEEK 1: Logic and Critical Thinking
        {
            title: "Logic and Critical Thinking",
            description:
                "The foundations of rational argumentation and logical analysis.",
            order: 1,
            lessons: [
                {
                    title: "What is Philosophy?",
                    description:
                        "Understanding the nature and methods of philosophical inquiry.",
                    order: 1,
                    informationPoints: [
                        {
                            title: "Philosophy Definition",
                            type: "definition",
                            content:
                                "Philosophy is the systematic study of fundamental questions about existence, knowledge, values, reason, and reality.",
                            order: 1,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Branches of Philosophy",
                            type: "concept",
                            content:
                                "The main branches are metaphysics (reality), epistemology (knowledge), ethics (morality), logic (reasoning), and aesthetics (beauty).",
                            order: 2,
                            quizTypes: [
                                "binary",
                                "multiple_choice",
                                "question_answer",
                            ],
                        },
                        {
                            title: "Philosophical Method",
                            type: "concept",
                            content:
                                "Philosophy proceeds through careful analysis of concepts, construction of arguments, and critical evaluation of competing views.",
                            order: 3,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Philosophy vs Science",
                            type: "concept",
                            content:
                                "While science investigates empirical facts through observation, philosophy examines conceptual and normative questions that cannot be settled by experiment alone.",
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
                    title: "Arguments and Validity",
                    description: "The structure of logical reasoning.",
                    order: 2,
                    informationPoints: [
                        {
                            title: "Argument Definition",
                            type: "definition",
                            content:
                                "An argument is a set of statements where some (premises) are offered as reasons to accept another (conclusion).",
                            order: 1,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Validity",
                            type: "definition",
                            content:
                                "An argument is valid if the conclusion follows necessarily from the premises—if the premises are true, the conclusion must be true.",
                            order: 2,
                            quizTypes: [
                                "binary",
                                "multiple_choice",
                                "question_answer",
                            ],
                        },
                        {
                            title: "Soundness",
                            type: "definition",
                            content:
                                "An argument is sound if it is both valid and all its premises are actually true.",
                            order: 3,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Valid but Unsound Example",
                            type: "example",
                            content:
                                "'All fish can fly. Salmon are fish. Therefore, salmon can fly.' This argument is valid (the logic works) but unsound (the first premise is false).",
                            order: 4,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                    ],
                },
                {
                    title: "Deductive Reasoning",
                    description: "Arguments that guarantee their conclusions.",
                    order: 3,
                    informationPoints: [
                        {
                            title: "Deductive Argument",
                            type: "definition",
                            content:
                                "A deductive argument claims that its premises provide conclusive support for its conclusion—if the premises are true, the conclusion must be true.",
                            order: 1,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Modus Ponens",
                            type: "concept",
                            content:
                                "Modus ponens: If P then Q; P; therefore Q. This is a fundamental valid argument form.",
                            order: 2,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Modus Tollens",
                            type: "concept",
                            content:
                                "Modus tollens: If P then Q; not Q; therefore not P. This valid form reasons backward from a denied consequence.",
                            order: 3,
                            quizTypes: [
                                "binary",
                                "multiple_choice",
                                "question_answer",
                            ],
                        },
                        {
                            title: "Syllogism",
                            type: "definition",
                            content:
                                "A syllogism is a deductive argument with two premises and a conclusion, typically involving categorical statements like 'All A are B.'",
                            order: 4,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                    ],
                },
                {
                    title: "Inductive Reasoning",
                    description:
                        "Arguments that provide probable support for conclusions.",
                    order: 4,
                    informationPoints: [
                        {
                            title: "Inductive Argument",
                            type: "definition",
                            content:
                                "An inductive argument claims that its premises make the conclusion probable, not certain—even true premises don't guarantee the conclusion.",
                            order: 1,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Strong vs Weak Induction",
                            type: "concept",
                            content:
                                "A strong inductive argument makes its conclusion highly probable; a weak one provides little support even if premises are true.",
                            order: 2,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Problem of Induction",
                            type: "concept",
                            content:
                                "David Hume argued that induction cannot be rationally justified—past patterns don't logically guarantee future ones.",
                            order: 3,
                            quizTypes: [
                                "binary",
                                "multiple_choice",
                                "question_answer",
                            ],
                        },
                        {
                            title: "Inference to Best Explanation",
                            type: "concept",
                            content:
                                "Inference to the best explanation accepts the hypothesis that best explains the available evidence, even without deductive certainty.",
                            order: 4,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                    ],
                },
                {
                    title: "Logical Fallacies",
                    description: "Common errors in reasoning to avoid.",
                    order: 5,
                    informationPoints: [
                        {
                            title: "Fallacy Definition",
                            type: "definition",
                            content:
                                "A fallacy is an error in reasoning that makes an argument invalid or weak, often appearing persuasive despite being logically flawed.",
                            order: 1,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Ad Hominem",
                            type: "concept",
                            content:
                                "Ad hominem attacks the person making an argument rather than addressing the argument itself.",
                            order: 2,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Straw Man",
                            type: "concept",
                            content:
                                "The straw man fallacy misrepresents someone's argument to make it easier to attack.",
                            order: 3,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Appeal to Authority",
                            type: "concept",
                            content:
                                "Appeal to authority fallaciously uses an authority figure's opinion as evidence, especially when they lack relevant expertise.",
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

        // WEEK 2: Metaphysics and Epistemology
        {
            title: "Metaphysics and Epistemology",
            description: "Fundamental questions about reality and knowledge.",
            order: 2,
            lessons: [
                {
                    title: "What is Real?",
                    description:
                        "Introduction to metaphysics and theories of reality.",
                    order: 1,
                    informationPoints: [
                        {
                            title: "Metaphysics Definition",
                            type: "definition",
                            content:
                                "Metaphysics is the branch of philosophy that studies the fundamental nature of reality, including existence, objects, properties, and causation.",
                            order: 1,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Materialism",
                            type: "concept",
                            content:
                                "Materialism holds that only physical matter exists; everything, including minds, can be explained in terms of physical processes.",
                            order: 2,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Idealism",
                            type: "concept",
                            content:
                                "Idealism holds that reality is fundamentally mental or mind-dependent; physical objects exist only as perceptions or ideas.",
                            order: 3,
                            quizTypes: [
                                "binary",
                                "multiple_choice",
                                "question_answer",
                            ],
                        },
                        {
                            title: "Dualism",
                            type: "concept",
                            content:
                                "Dualism holds that reality consists of two fundamentally different substances: mind and matter.",
                            order: 4,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                    ],
                },
                {
                    title: "Personal Identity",
                    description: "What makes you the same person over time?",
                    order: 2,
                    informationPoints: [
                        {
                            title: "Personal Identity Problem",
                            type: "concept",
                            content:
                                "The problem of personal identity asks what makes a person at one time the same person at a later time, despite physical and psychological changes.",
                            order: 1,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Psychological Continuity",
                            type: "concept",
                            content:
                                "The psychological continuity view holds that personal identity consists in connected memories, personality traits, and mental states.",
                            order: 2,
                            quizTypes: [
                                "binary",
                                "multiple_choice",
                                "question_answer",
                            ],
                        },
                        {
                            title: "Bodily Continuity",
                            type: "concept",
                            content:
                                "The bodily continuity view holds that personal identity requires the same physical body, especially the brain.",
                            order: 3,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Ship of Theseus",
                            type: "example",
                            content:
                                "The Ship of Theseus asks whether a ship that has had all its parts gradually replaced remains the same ship—illustrating puzzles about identity over time.",
                            order: 4,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                    ],
                },
                {
                    title: "What is Knowledge?",
                    description: "The nature and conditions of knowledge.",
                    order: 3,
                    informationPoints: [
                        {
                            title: "Epistemology Definition",
                            type: "definition",
                            content:
                                "Epistemology is the branch of philosophy that studies the nature, sources, and limits of knowledge.",
                            order: 1,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Justified True Belief",
                            type: "concept",
                            content:
                                "The traditional analysis defines knowledge as justified true belief: you know P if you believe P, P is true, and you have good reasons for believing P.",
                            order: 2,
                            quizTypes: [
                                "binary",
                                "multiple_choice",
                                "question_answer",
                            ],
                        },
                        {
                            title: "Gettier Problem",
                            type: "concept",
                            content:
                                "Gettier cases show that justified true belief is not sufficient for knowledge—you can have JTB by luck without genuine knowledge.",
                            order: 3,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "A Priori vs A Posteriori",
                            type: "concept",
                            content:
                                "A priori knowledge is independent of experience (like math), while a posteriori knowledge depends on sensory experience.",
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
                    title: "Skepticism",
                    description: "Challenges to our claims of knowledge.",
                    order: 4,
                    informationPoints: [
                        {
                            title: "Skepticism Definition",
                            type: "definition",
                            content:
                                "Skepticism is the view that knowledge is impossible or that we should suspend judgment about what we think we know.",
                            order: 1,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Descartes' Demon",
                            type: "example",
                            content:
                                "Descartes imagined an evil demon deceiving us about all our beliefs—if we can't rule this out, can we know anything about the external world?",
                            order: 2,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Brain in a Vat",
                            type: "example",
                            content:
                                "The brain in a vat scenario asks: how do you know you're not just a brain being fed simulated experiences by a computer?",
                            order: 3,
                            quizTypes: [
                                "binary",
                                "multiple_choice",
                                "question_answer",
                            ],
                        },
                        {
                            title: "Cogito Ergo Sum",
                            type: "concept",
                            content:
                                "Descartes argued 'I think, therefore I am'—even if deceived about everything else, the fact that I'm thinking proves I exist.",
                            order: 4,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                    ],
                },
                {
                    title: "Sources of Knowledge",
                    description: "How do we acquire knowledge about the world?",
                    order: 5,
                    informationPoints: [
                        {
                            title: "Empiricism",
                            type: "concept",
                            content:
                                "Empiricism holds that all knowledge of the world comes from sensory experience; the mind starts as a 'blank slate.'",
                            order: 1,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Rationalism",
                            type: "concept",
                            content:
                                "Rationalism holds that reason, independent of experience, is a source of knowledge; some ideas may be innate.",
                            order: 2,
                            quizTypes: [
                                "binary",
                                "multiple_choice",
                                "question_answer",
                            ],
                        },
                        {
                            title: "Kant's Synthesis",
                            type: "concept",
                            content:
                                "Kant argued that knowledge requires both experience and innate mental structures that organize that experience.",
                            order: 3,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Testimony",
                            type: "concept",
                            content:
                                "Testimony is knowledge gained from others' reports; most of what we know comes from trusting reliable sources rather than direct experience.",
                            order: 4,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                    ],
                },
            ],
        },

        // WEEK 3: Ethics
        {
            title: "Ethics",
            description:
                "The philosophical study of morality and how we ought to live.",
            order: 3,
            lessons: [
                {
                    title: "Moral Philosophy Basics",
                    description: "Introduction to ethical theory.",
                    order: 1,
                    informationPoints: [
                        {
                            title: "Ethics Definition",
                            type: "definition",
                            content:
                                "Ethics is the branch of philosophy that studies questions of right and wrong, good and bad, and how we ought to live.",
                            order: 1,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Descriptive vs Normative Ethics",
                            type: "concept",
                            content:
                                "Descriptive ethics describes what people believe is moral; normative ethics prescribes what actually is moral.",
                            order: 2,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Metaethics",
                            type: "definition",
                            content:
                                "Metaethics examines the nature of morality itself: Are moral facts objective? What do moral terms mean?",
                            order: 3,
                            quizTypes: [
                                "binary",
                                "multiple_choice",
                                "question_answer",
                            ],
                        },
                        {
                            title: "Moral Relativism",
                            type: "concept",
                            content:
                                "Moral relativism holds that moral truths vary by culture or individual; there are no universal moral standards.",
                            order: 4,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                    ],
                },
                {
                    title: "Consequentialism",
                    description: "Judging actions by their outcomes.",
                    order: 2,
                    informationPoints: [
                        {
                            title: "Consequentialism Definition",
                            type: "definition",
                            content:
                                "Consequentialism judges actions as right or wrong based solely on their consequences—the ends justify the means.",
                            order: 1,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Utilitarianism",
                            type: "concept",
                            content:
                                "Utilitarianism holds that the right action is the one that produces the greatest happiness for the greatest number.",
                            order: 2,
                            quizTypes: [
                                "binary",
                                "multiple_choice",
                                "question_answer",
                            ],
                        },
                        {
                            title: "Act vs Rule Utilitarianism",
                            type: "concept",
                            content:
                                "Act utilitarianism judges each action by its consequences; rule utilitarianism asks which rules, if generally followed, would maximize happiness.",
                            order: 3,
                            quizTypes: [
                                "binary",
                                "multiple_choice",
                                "question_answer",
                            ],
                        },
                        {
                            title: "Trolley Problem",
                            type: "example",
                            content:
                                "The trolley problem asks whether you should divert a trolley to kill one person instead of five, testing utilitarian intuitions against other moral concerns.",
                            order: 4,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                    ],
                },
                {
                    title: "Deontology",
                    description: "Ethics based on duty and rules.",
                    order: 3,
                    informationPoints: [
                        {
                            title: "Deontology Definition",
                            type: "definition",
                            content:
                                "Deontology judges actions as right or wrong based on whether they conform to moral rules or duties, regardless of consequences.",
                            order: 1,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Categorical Imperative",
                            type: "concept",
                            content:
                                "Kant's categorical imperative: Act only according to rules you could will to be universal laws for everyone.",
                            order: 2,
                            quizTypes: [
                                "binary",
                                "multiple_choice",
                                "question_answer",
                            ],
                        },
                        {
                            title: "Humanity Formula",
                            type: "concept",
                            content:
                                "Kant's humanity formula: Always treat people as ends in themselves, never merely as means to your own ends.",
                            order: 3,
                            quizTypes: [
                                "binary",
                                "multiple_choice",
                                "question_answer",
                            ],
                        },
                        {
                            title: "Moral Absolutism",
                            type: "concept",
                            content:
                                "Moral absolutism holds that some actions (like lying or murder) are always wrong, regardless of circumstances or consequences.",
                            order: 4,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                    ],
                },
                {
                    title: "Virtue Ethics",
                    description:
                        "Ethics focused on character rather than actions.",
                    order: 4,
                    informationPoints: [
                        {
                            title: "Virtue Ethics Definition",
                            type: "definition",
                            content:
                                "Virtue ethics focuses on developing good character traits (virtues) rather than following rules or maximizing outcomes.",
                            order: 1,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Aristotle's Eudaimonia",
                            type: "concept",
                            content:
                                "Aristotle argued the goal of life is eudaimonia (flourishing), achieved through exercising virtues in accordance with reason.",
                            order: 2,
                            quizTypes: [
                                "binary",
                                "multiple_choice",
                                "question_answer",
                            ],
                        },
                        {
                            title: "Golden Mean",
                            type: "concept",
                            content:
                                "Virtues lie at a mean between extremes: courage is between cowardice and recklessness; generosity between stinginess and wastefulness.",
                            order: 3,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Practical Wisdom",
                            type: "concept",
                            content:
                                "Practical wisdom (phronesis) is the ability to discern the right action in particular circumstances—it cannot be reduced to following rules.",
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
                    title: "Applied Ethics",
                    description:
                        "Applying ethical theories to real-world issues.",
                    order: 5,
                    informationPoints: [
                        {
                            title: "Applied Ethics Definition",
                            type: "definition",
                            content:
                                "Applied ethics uses ethical theories to analyze specific moral issues like abortion, euthanasia, animal rights, and environmental ethics.",
                            order: 1,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Moral Status",
                            type: "concept",
                            content:
                                "Questions of moral status ask which beings deserve moral consideration—only humans? Animals? Future generations? AI?",
                            order: 2,
                            quizTypes: [
                                "binary",
                                "multiple_choice",
                                "question_answer",
                            ],
                        },
                        {
                            title: "Rights vs Welfare",
                            type: "concept",
                            content:
                                "Rights-based approaches emphasize inviolable individual rights; welfare-based approaches focus on promoting well-being and reducing suffering.",
                            order: 3,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Reflective Equilibrium",
                            type: "concept",
                            content:
                                "Reflective equilibrium balances our moral intuitions with ethical principles, adjusting each to achieve coherence.",
                            order: 4,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                    ],
                },
            ],
        },

        // WEEK 4: Philosophy of Mind
        {
            title: "Philosophy of Mind",
            description:
                "The nature of consciousness, mental states, and the mind-body problem.",
            order: 4,
            lessons: [
                {
                    title: "The Mind-Body Problem",
                    description: "How do mind and body relate to each other?",
                    order: 1,
                    informationPoints: [
                        {
                            title: "Mind-Body Problem",
                            type: "definition",
                            content:
                                "The mind-body problem asks how mental states (thoughts, feelings) relate to physical states (brain processes).",
                            order: 1,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Substance Dualism",
                            type: "concept",
                            content:
                                "Substance dualism (Descartes) holds that mind and body are two fundamentally different substances that somehow interact.",
                            order: 2,
                            quizTypes: [
                                "binary",
                                "multiple_choice",
                                "question_answer",
                            ],
                        },
                        {
                            title: "Interaction Problem",
                            type: "concept",
                            content:
                                "The interaction problem asks how an immaterial mind could causally affect a physical body if they're completely different substances.",
                            order: 3,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Physicalism",
                            type: "concept",
                            content:
                                "Physicalism holds that everything, including mental states, is ultimately physical—the mind just is the brain.",
                            order: 4,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                    ],
                },
                {
                    title: "Consciousness",
                    description: "The nature of subjective experience.",
                    order: 2,
                    informationPoints: [
                        {
                            title: "Consciousness Definition",
                            type: "definition",
                            content:
                                "Consciousness is the subjective, first-person experience of being aware—there is 'something it is like' to be conscious.",
                            order: 1,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Hard Problem of Consciousness",
                            type: "concept",
                            content:
                                "The hard problem asks why physical processes give rise to subjective experience at all—why isn't everything just 'dark inside'?",
                            order: 2,
                            quizTypes: [
                                "binary",
                                "multiple_choice",
                                "question_answer",
                            ],
                        },
                        {
                            title: "Qualia",
                            type: "definition",
                            content:
                                "Qualia are the subjective, qualitative aspects of experience—like the redness of red or the painfulness of pain.",
                            order: 3,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Mary's Room",
                            type: "example",
                            content:
                                "Mary, a colorblind scientist who knows all physical facts about color, learns something new when she sees red for the first time—suggesting qualia aren't physical.",
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
                    title: "Free Will",
                    description: "Do we have genuine freedom of choice?",
                    order: 3,
                    informationPoints: [
                        {
                            title: "Free Will Problem",
                            type: "concept",
                            content:
                                "The free will problem asks whether our choices are genuinely free or determined by prior causes like genetics and environment.",
                            order: 1,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Determinism",
                            type: "definition",
                            content:
                                "Determinism holds that every event, including human decisions, is the inevitable result of prior causes according to natural laws.",
                            order: 2,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Libertarian Free Will",
                            type: "concept",
                            content:
                                "Libertarian free will holds that humans have genuine freedom to choose between alternatives, not determined by prior causes.",
                            order: 3,
                            quizTypes: [
                                "binary",
                                "multiple_choice",
                                "question_answer",
                            ],
                        },
                        {
                            title: "Compatibilism",
                            type: "concept",
                            content:
                                "Compatibilism holds that free will and determinism are compatible—we're free when we act on our own desires without external coercion.",
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
                    title: "Artificial Intelligence",
                    description: "Can machines think?",
                    order: 4,
                    informationPoints: [
                        {
                            title: "Turing Test",
                            type: "concept",
                            content:
                                "The Turing test proposes that a machine is intelligent if it can fool a human into thinking they're conversing with another human.",
                            order: 1,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Chinese Room",
                            type: "example",
                            content:
                                "Searle's Chinese Room argues that a computer manipulating symbols according to rules doesn't understand meaning—syntax isn't semantics.",
                            order: 2,
                            quizTypes: [
                                "binary",
                                "multiple_choice",
                                "question_answer",
                            ],
                        },
                        {
                            title: "Strong vs Weak AI",
                            type: "concept",
                            content:
                                "Weak AI simulates intelligence; strong AI would actually have a mind with understanding and consciousness.",
                            order: 3,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Functionalism",
                            type: "concept",
                            content:
                                "Functionalism defines mental states by their functional role—if AI has the same functional organization as a mind, it has a mind.",
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
                    title: "Personal Identity Revisited",
                    description:
                        "Identity puzzles in light of philosophy of mind.",
                    order: 5,
                    informationPoints: [
                        {
                            title: "Teleporter Problem",
                            type: "example",
                            content:
                                "If a teleporter destroys you and creates an exact copy elsewhere, does the copy continue your identity or is it a new person?",
                            order: 1,
                            quizTypes: [
                                "binary",
                                "multiple_choice",
                                "question_answer",
                            ],
                        },
                        {
                            title: "Fission Cases",
                            type: "example",
                            content:
                                "If your brain were split and each half put in a new body, which one would be you? Both? Neither? This challenges our concept of identity.",
                            order: 2,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "Narrative Identity",
                            type: "concept",
                            content:
                                "Narrative identity views the self as constituted by the story we tell about our lives, integrating past and future into a coherent whole.",
                            order: 3,
                            quizTypes: ["binary", "multiple_choice"],
                        },
                        {
                            title: "No-Self View",
                            type: "concept",
                            content:
                                "Some philosophers (influenced by Buddhism) argue there is no enduring self—just a series of connected mental states with no underlying owner.",
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
