const BEHAVIOURS = [
  {
    label: "Sleeping in Bed",
    subBehaviours: [],
    color: "#56CCF2"
  },
  {
    label: "Sleeping in Chair",
    subBehaviours: [],
    color: "#56CCF2"
  },
  {
    label: "Awake/Calm",
    subBehaviours: [],
    color: "#6FCF97"
  },
  {
    label: "Positively Engaged",
    subBehaviours: ["Conversing/Singing", "Hugging/Hand Holding", "Smiling"],
    color: "#6FCF97"
  },
  {
    label: "Noisy",
    subBehaviours: [
      "Crying",
      "Words",
      "Grunting/Moaning",
      "Questions/Requests"
    ],
    color: "#F2C94C"
  },
  {
    label: "Restless",
    subBehaviours: [
      "Fidgeting/Pacing",
      "Exploring/Searching",
      "Rattling/Rocking"
    ],
    color: "#F2994A"
  },
  {
    label: "Exit Seeking",
    subBehaviours: [],
    color: "#864A28"
  },
  {
    label: "Aggressive - Verbal",
    subBehaviours: ["Insults", "Swearing", "Screaming"],
    color: "#FEA3A3"
  },
  {
    label: "Aggressive - Physical",
    subBehaviours: [
      "Biting",
      "Kicking",
      "Grabbing/Pulling",
      "Punching/Pushing",
      "Throwing",
      "Self-Injury"
    ],
    color: "#EB5757"
  },
  {
    label: "Aggressive - Sexual",
    subBehaviours: [
      "Explicit Comments",
      "Public Masturbation",
      "Touching Others"
    ],
    color: "#9B51E0"
  }
];

export default BEHAVIOURS;
