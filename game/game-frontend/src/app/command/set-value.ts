import { UndoableCommand } from 'interacto';
import { Game } from '../classes/game';

export class SetValue extends UndoableCommand {
  private oldValue: number | undefined;
  private oldSuggestions: string | undefined;

  public constructor(
    private newValue: number,
    private index: number,
    private game: Game
  ) {
    super();
  }

  protected override createMemento() {
    this.oldValue = this.game.values[this.index];
    this.oldSuggestions = this.game.gridSuggestions[this.index];
  }

  public override canExecute(): boolean {
    return this.game.values[this.index] !== this.newValue;
  }

  protected execution(): void {
    this.game.jouerCoup(this.index, this.newValue);
  }

  public redo(): void {
    this.game.setGridValue(this.index, this.newValue);
  }

  public undo(): void {
    this.game.setGridValue(this.index, this.oldValue!);
  }

  public override getVisualSnapshot():
    | Promise<HTMLElement>
    | HTMLElement
    | undefined {
    return SetValue.getSnapshot(this.game, this.index, this.oldSuggestions);
  }

  public static getSnapshot(
    game: Game,
    indexChanged?: number,
    suggestion?: string
  ): HTMLImageElement {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const tileSize = 110;
    canvas.width = 1000;
    canvas.height = 1000;
    ctx.font = '100px Bodo';

    //multiple choice boards in purple
    if (suggestion && suggestion.length > 1) {
      ctx.fillStyle = 'purple';

      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    //changed tile in green
    if (indexChanged) {
      ctx.fillStyle = 'green';
      ctx.fillRect(
        (indexChanged % 9) * tileSize,
        Math.floor(indexChanged / 9) * tileSize,
        tileSize,
        tileSize
      );
    }

    //duplacate tiles in red
    for (let j = 0; j < game.booleanValues.length; j++) {
      if (!game.booleanValues[j]) {
        ctx.fillStyle = 'red';
        ctx.fillRect(
          (j % 9) * tileSize,
          Math.floor(j / 9) * tileSize,
          tileSize,
          tileSize
        );
      }
    }
    ctx.fillStyle = 'black';
    for (let i = 0; i < game.values.length; i++) {
      ctx.fillText(
        game.values[i]?.toString() ?? '',
        (i % 9) * tileSize + 30,
        Math.floor(i / 9) * tileSize + 85
      );
    }
    for (let i = 1; i < 9; i++) {
      ctx.moveTo(i * tileSize, 0);
      ctx.lineTo(i * tileSize, canvas.height);
      ctx.moveTo(0, i * tileSize);
      ctx.lineTo(canvas.width, i * tileSize);
    }
    ctx.stroke(); // Draw the content
    const imgCache = new Image();
    imgCache.src = canvas.toDataURL('image/png');

    return imgCache;
  }
}
