import { Component, OnInit, Inject } from '@angular/core';
import { Dish } from '../shared/dish';

import { DishService } from "../services/dish.service";

import { switchMap } from "rxjs/operators";

import { Params, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";

import { FormBuilder, FormGroup, Validators, FormControl, FormControlName } from "@angular/forms";
import { Comment } from "../shared/comment";

import { visibility, flyInOut, expand } from "../animations/app.animation";

const DISH = {
  id: '0',
  name: 'Uthappizza',
  image: '/assets/images/uthappizza.png',
  category: 'mains',
  featured: true,
  label: 'Hot',
  price: '4.99',
  // tslint:disable-next-line:max-line-length
  description: 'A unique combination of Indian Uthappam (pancake) and Italian pizza, topped with Cerignola olives, ripe vine cherry tomatoes, Vidalia onion, Guntur chillies and Buffalo Paneer.',
  comments: [
       {
           rating: 5,
           comment: 'Imagine all the eatables, living in conFusion!',
           author: 'John Lemon',
           date: '2012-10-16T17:57:28.556094Z'
       },
       {
           rating: 4,
           comment: 'Sends anyone to heaven, I wish I could get my mother-in-law to eat it!',
           author: 'Paul McVites',
           date: '2014-09-05T17:57:28.556094Z'
       },
       {
           rating: 3,
           comment: 'Eat it, just eat it!',
           author: 'Michael Jaikishan',
           date: '2015-02-13T17:57:28.556094Z'
       },
       {
           rating: 4,
           comment: 'Ultimate, Reaching for the stars!',
           author: 'Ringo Starry',
           date: '2013-12-02T17:57:28.556094Z'
       },
       {
           rating: 2,
           comment: 'It\'s your birthday, we\'re gonna party!',
           author: '25 Cent',
           date: '2011-12-02T17:57:28.556094Z'
       }
   ]
};

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.css'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations: [
    visibility(),
    flyInOut(),
    expand()
  ]
})
export class DishdetailComponent implements OnInit {

    formErrors = {
        'author': '',
        'comment': ''
      };
    
      validationMessages = {
        'author': {
          'required':      'Name is required.',
          'minlength':     'Name must be at least 2 characters long.'
        },
        'comment': {
          'required':      'Comment is required.',
          'minlength':     'Comment must be at least 2 characters long.'
        },
      };

    //@Input()
    dish: Dish;
    dishIds: string[];
    prev: string;
    next: string;

    commentForm: FormGroup;
    comment: Comment;

    errMess: string;
    dishCopy: Dish;

    visibility = 'shown';
    
    constructor(private dishservice: DishService,
        private route: ActivatedRoute,
        private location: Location,
        private fb: FormBuilder,
        @Inject('BaseURL') private BaseURL) {
            this.createForm();
         }

    ngOnInit() {
        this.dishservice.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
        this.route.params
         .pipe(switchMap((params: Params) => { this.visibility = 'hidden'; return this.dishservice.getDish(params['id']);  }))
         .subscribe(dish => { this.dish = dish; this.dishCopy = dish; this.setPrevNext(dish.id); this.visibility = 'shown'; },
          errmess => this.errMess = <any>errmess);
    }

    goBack(): void {
        this.location.back();
    }

    setPrevNext(dishId: string) {
        const index = this.dishIds.indexOf(dishId);
        this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
        this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
    }

    createForm() {
        this.commentForm = this.fb.group({
            author: ['', [Validators.required, Validators.minLength(2)]],
            rating: [5],
            comment: ['', [Validators.required, Validators.minLength(2)]]
        });

        this.commentForm.valueChanges.subscribe(data => this.onValueChanged(data));
        this.onValueChanged();
    }

    onValueChanged(data?: any) {
        if (!this.commentForm) { return; }
        const form = this.commentForm;
        for (const field in this.formErrors) {
          if (this.formErrors.hasOwnProperty(field)) {
            // clear previous error message (if any)
            this.formErrors[field] = '';
            const control = form.get(field);
            if (control && control.dirty && !control.valid) {
              const messages = this.validationMessages[field];
              for (const key in control.errors) {
                if (control.errors.hasOwnProperty(key)) {
                  this.formErrors[field] += messages[key] + ' ';
                }
              }
            }
          }
        }
      }

      onSubmit() {
        this.comment = this.commentForm.value;
        var spc = this.comment;
        spc.date = new Date().toISOString();

        this.dishCopy.comments.push(this.comment);
        this.dishservice.putDish(this.dishCopy)
         .subscribe(dish => {
           this.dish = dish; this.dishCopy = dish;
         }, 
         errmess => {this.dish = null; this.dishCopy = null; this.errMess = <any>errmess; });

        this.commentForm.reset({
          author: '',
          rating: 5,
          comment: ''
        });
      }

}
