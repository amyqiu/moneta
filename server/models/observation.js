const mongoose = require('mongoose');

const { Schema } = mongoose;

const defaultBehaviours = {
  'Sleeping in Bed': [], // standalone
  'Sleeping in Chair': [], // standalone
  'Awake/Calm': [], // standalone
  'Positively Engaged': [], // top-level
  'Conversing/Singing': [],
  'Hugging/Hand Holding': [],
  Smiling: [],
  Noisy: [], // top-level
  Crying: [],
  Words: [],
  'Grunting/Moaning': [],
  'Questions/Requests': [],
  Restless: [], // top-level
  'Fidgeting/Pacing': [],
  'Exploring/Searching': [],
  'Rattling/Rocking': [],
  'Exit Seeking': [], // standalone
  'Aggressive - Verbal': [], // top-level
  Insults: [],
  Swearing: [],
  Screaming: [],
  'Aggressive - Physical': [], // top-level
  Biting: [],
  Kicking: [],
  'Grabbing/Pulling': [],
  'Punching/Pushing': [],
  Throwing: [],
  'Self-Injury': [],
  'Aggressive - Sexual': [], // top-level
  'Explicit Comments': [],
  'Public Masturbation': [],
  'Touching Others': [],
};

const defaultContexts = {
  Alone: [],
  'Loud/Busy Environment': [],
  'Quiet Environment': [],
  'Family/Visitors': [],
  Bathing: [],
  'Eating/Drinking': [],
  'Behavioural Medication': [],
  'Pain Medication': [],
  Treatment: [],
  'Directed at Residents': [],
  'Directed at Staff': [],
};

const defaultLocations = {
  'Common Areas': [],
  'Individual Room': [],
  Cafeteria: [],
  Other: [],
};

// Define ObservationSchema
const ObservationSchema = new Schema({
  patient_ID: { type: String, required: true, max: 100 },
  start_time: { type: Date, required: true },
  end_time: { type: Date, required: false },
  entries: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Entry' }], default: [] },
  aggregated_behaviours: { type: Map, of: [Number], default: defaultBehaviours },
  aggregated_contexts: { type: Map, of: [Number], default: defaultContexts },
  aggregated_locations: { type: Map, of: [Number], default: defaultLocations },
  entry_times: { type: [Date], default: [] },
  reasons: {
    type: Array, of: String, required: false, default: [],
  },
  starting_notes: { type: String, required: false, default: '' },
  ending_notes: { type: String, required: false, default: '' },
  next_steps: {
    type: Array, of: String, required: false, default: [],
  },
});

module.exports = mongoose.model('Observation', ObservationSchema);
