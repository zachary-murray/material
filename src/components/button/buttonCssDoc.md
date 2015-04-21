#md-button


The base class for all buttons is .md-button. This class is applied automatically to the md-button directive.

The public css of this class
```css

.md-button {
  padding: 0 0.6rem;
  margin: 0.6rem 0.8rem;
  min-width: 8.8rem;
  text-align: center;
  text-transform: uppercase;
  text-decoration: none;
  cursor: pointer;
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



