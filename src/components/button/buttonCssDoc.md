#md-button


The base class for all buttons is .md-button. This class is applied automatically to the md-button directive.

The public css of this class
```css

.md-button {      
  padding:        0 0.6rem;
  margin:         0.6rem 0.8rem;
  min-width:      8.8rem;
  text-align:     center;
  text-transform: uppercase;
  text-decoration:none;
  cursor:         pointer;
  }
```

## Flat buttons

This is the default button:
```html
<md-button>Button</md-button>
```


![flatbutton](https://cloud.githubusercontent.com/assets/1292882/7253450/758633da-e845-11e4-8ae3-adc1ddf4ac98.PNG)

##Raised buttons

Add the md-raised class to create a raised button

```html
<md-button class="md-raised">Button</md-button>
```

![raisedbutton](https://cloud.githubusercontent.com/assets/1292882/7254163/fe898728-e849-11e4-943b-a9cd88ec9573.PNG)

This is the css declaration of the class

```css
.md-button.md-raised:not([disabled]) {
box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.26);
}
```

##Cornered buttons

Add the md-cornered class to create a button with corners:

```html
<md-button class="md-raised md-cornered">Button</md-button>
```


![corneredbutton](https://cloud.githubusercontent.com/assets/1292882/7254379/682592ac-e84b-11e4-8d33-78314cea8bda.PNG)

This is the css declaration of the class

```css
 .md-button.md-cornered {
    border-radius: 0; 
 }
```

##Floating action buttons (FAB buttons)

###Default FAB buttons

Add the md-fab button in order to create a floating action button.
```html
       <md-button class="md-fab" aria-label="Eat cake">
            <md-icon md-svg-src="img/icons/cake.svg"></md-icon>
        </md-button>
```

![floatingbutton](https://cloud.githubusercontent.com/assets/1292882/7254736/8fec7ee8-e84d-11e4-9cf9-58ea9221c3c2.PNG)

The css declaration of the md-fab button is

```css
  .md-button.md-fab {
    line-height: 5.6rem;
    min-width: 0;
    width: 5.6rem;
    height: 5.6rem;
    border-radius: 50%;
   }
```

###Mini FAB buttons

In order to create small FAB buttons add the md-mini class

```html
<md-button class="md-fab md-mini" aria-label="Eat cake">
            <md-icon md-svg-src="img/icons/cake.svg"></md-icon>
</md-button>
```
The small button is on the right side:

![minibutton](https://cloud.githubusercontent.com/assets/1292882/7273617/1fcca280-e8fe-11e4-9588-231a9e860be1.PNG)

The css declaration of the md-mini class is
```css
.md-button.md-fab.md-mini {
      line-height: 4rem;
      width: 4rem;
      height: 4rem; }
```

##Icon button

Create icon buttons by adding the md-icon class

```html
<md-button class="md-icon-button md-primary" aria-label="Settings">
        <md-icon md-svg-icon="img/icons/menu.svg"></md-icon>
</md-button>
```

![iconbutton](https://cloud.githubusercontent.com/assets/1292882/7273908/d701bd8a-e900-11e4-84c7-44c580c7372d.PNG)

The css decalaration of the md-icon-button is 
 ```css
  .md-button.md-icon-button {
    margin: 0 0.6rem;
    height: 4.8rem;
    min-width: 0;
    line-height: 4.8rem;
    padding-left: 0;
    padding-right: 0;
    width: 4.8rem; }
```
