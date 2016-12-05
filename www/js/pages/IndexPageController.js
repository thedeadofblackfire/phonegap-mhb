/*jslint browser: true*/
/*global console*/

var app = app || {};
app.pages = app.pages || {};

var welcomescreen;

app.pages.IndexPageController = function (app, $$) {
  'use strict';
  
  // Init method
  (function () {
    var options = {
	  'open': false,
	  'closeButtonText': 'Fermer',
      'bgcolor': '#00A77F',
		//	  '#0da6ec',
      'fontcolor': '#fff',
      'onOpened': function () {
        console.log("welcome screen opened");
      },
      'onClosed': function () {
        console.log("welcome screen closed");
      }
    },
    welcomescreen_slides = [
      {
        id: 'slide0',
        picture: '<div class="tutorialicon"><img src="img/logo_white.svg" width="256" height="256"></div>',
        text: 'Bienvenue dans le tutorial de présentation. Dans les <a class="tutorial-next-link" href="#">prochaines étapes</a>, nous allons vous guider à travers ce manuel pour vous apprendre comment utiliser cette application.'
      },
      {
        id: 'slide1',
		picture: '<div class="tutorialicon"><img src="img/puzzle_animation.svg" width="256" height="256"><!--♫--></div>',
        text: 'L\'horloge affiche les couleurs en fonction de vos prises de médicament' 
      },
      {
        id: 'slide2',
		picture: '<div class="tutorialicon"><img src="img/focus.svg" width="256" height="256"><!--✲--></div>',
        text: 'Vous pouvez prendre en photo votre ordonnance pour que votre pharmacien puisse préparer vos médicaments et vous informe quand vos pilluliers sont disponibles en pharmacie.'
      },
      {
        id: 'slide3',
        picture: '<div class="tutorialicon">☆</div>',
        text: 'Merci d\'avoir lu avec attention! Appréciez maintenant cette application ou revenir au <a class="tutorial-previous-slide" href="#">slide précédent</a>.<br><br><a class="tutorial-close-btn" href="#">Fin du Tutorial</a>'
      }
    ],
    welcomescreen = app.welcomescreen(welcomescreen_slides, options);
    
    $$(document).on('click', '.tutorial-close-btn', function () {
      welcomescreen.close();
    });

	/*
    $$('.tutorial-open-btn').click(function () {
      welcomescreen.open();  
    });
	*/
    
	$$(document).on('click', '.tutorial-open-btn', function (e) {
      welcomescreen.open();  
    });
	
    $$(document).on('click', '.tutorial-next-link', function (e) {
      welcomescreen.next(); 
    });
    
    $$(document).on('click', '.tutorial-previous-slide', function (e) {
      welcomescreen.previous(); 
    });
  
  }());

};