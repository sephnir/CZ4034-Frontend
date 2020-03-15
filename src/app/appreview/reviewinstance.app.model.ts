export class reviewinstance{
    username: string;
    review: string;
    score: string
    thumbsUp: string;
    userImage: string;
    reviewDate: string

    constructor(username,review,score,thumbsUp,userImage,reviewDate){
        this.username = username;
        this.review = review;
        this.score = score;
        this.thumbsUp = thumbsUp;
        this.userImage = userImage;
        this.reviewDate = reviewDate;
    }
}