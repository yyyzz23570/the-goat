type Feedback = {
  itineraryId: string;
  rating: "helpful" | "not_helpful";
  satisfactionScore?: number;
  trustScore?: number;
  issueType?: string;
  note?: string;
  itineraryVersion?: string;
  dataVersionId?: string;
  createdAt: string;
};

const feedback: Feedback[] = [];

export async function saveFeedback(entry: Feedback) {
  feedback.unshift(entry);
  return { persisted: false, storage: "memory" as const };
}

export async function getFeedback() {
  return feedback.slice(0, 20);
}
