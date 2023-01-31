export class Player {
  private nameValue: string;
  private scoreValue: number;

  constructor(name: string, score: number) {
    this.nameValue = name;
    this.scoreValue = score;
  }

  public incrementScore() {
    this.scoreValue++;
  }

  public get name() {
    return this.nameValue;
  }

  public set name(value: string) {
    this.nameValue = value;
  }
  public get score() {
    return this.scoreValue;
  }

  public set score(score: number) {
    this.scoreValue = score;
  }
}
