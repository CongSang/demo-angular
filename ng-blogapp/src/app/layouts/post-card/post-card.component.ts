import { Component, Input, OnInit } from '@angular/core';
import moment from 'moment';
import { IPostResponse } from '../../models/post';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.scss'
})
export class PostCardComponent implements OnInit {

  @Input() postData?: IPostResponse;

  constructor() { }

  ngOnInit(): void {
  }

  onReturnDate(value: any) {
    let time = value?.toDate();
    return moment(time).startOf('seconds').fromNow();
  }

}
