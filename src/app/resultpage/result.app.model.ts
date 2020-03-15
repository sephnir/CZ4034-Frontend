export class appresult{
    id: string;
    icon: string;
    title: string;
    description : string;
    genre: string;
    scoreText: string;
    appId: string;

    constructor(id,icon,title,description,genre,scoreText,appId){
        this.id = id;
        this.icon = icon;
        this.title = title;
        this.description = description;
        this.genre = genre;
        this.scoreText = scoreText;
        this.appId = appId;
    }
}