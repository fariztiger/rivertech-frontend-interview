import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, Subscription } from 'rxjs';
import { GameMockClient, IGame } from 'src/app/shared';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  game!: IGame;
  sub: Subscription = new Subscription();
  id: any;
  game$: Observable<IGame> = new Observable();

  constructor(
    private route: ActivatedRoute,
    private gameMockClient: GameMockClient,
    private spinner: NgxSpinnerService,
    private store: Store,
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.spinner.show();

    this.game$ = this.store.select(state => state.GameState.selectedGame);
		this.sub = this.game$.subscribe((game: IGame) => {
      this.game = game;
      this.spinner.hide();

      // add game to last played
      this.addToLastPlayed()
		});
  }

  addToLastPlayed = () => {
    let lastPlayed: IGame[] = this.gameMockClient.getLastPlayedGames();
    
    // check if the game id exist in last played
    let exists = lastPlayed.some((game: any) => game.slug.includes(this.id));

    if (!exists) {
      lastPlayed.push(this.game);
      window.localStorage.setItem('casinoLastPlayed', JSON.stringify(lastPlayed));
    }
  }

}
