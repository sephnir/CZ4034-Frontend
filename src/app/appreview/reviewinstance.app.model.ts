export class reviewinstance {
	username: string;
	review: string;
	score: string;
	thumbsUp: string;
	userImage: string;
	reviewDate: string;
	sentiment: number;
	useful: boolean;

	constructor(
		username,
		review,
		score,
		thumbsUp,
		userImage,
		reviewDate,
		sentiment,
		useful
	) {
		this.username = username;
		this.review = review;
		this.score = score;
		this.thumbsUp = thumbsUp;
		this.userImage = userImage;
		this.reviewDate = reviewDate;
		this.sentiment = sentiment;
		this.useful = useful;
	}
}
