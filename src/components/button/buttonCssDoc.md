#md-button


The base class for all buttons is .md-button. This class is applied automatically to the md-button directive. The public base CSS of this component uses the `.md-button` class:

```css
.md-button {      
  font-size:      14px;
  border-radius:  3px;
  padding:        0 6px 0 6px;
  margin:         6px 8px 6px 8px;
  min-width:      88px;
  text-align:     center;
  text-transform: uppercase;
  text-decoration:none;
  border:         none;
  outline:        none;
  }
```

### Theme Requirements

All Angular Material components have specific CSS rules dependent upon the Theme name and theme-class overrides.
For example, if using the Default theme, then each component will have a `.md-default-theme` class. Standard theme color overrides include optional classes `md-primary`, `md-accent`, and `md-warn`.

When defining custom CSS overrides, developers should create their own class and then append it to the full class specification for that component. For example to define a `.btn1` override to **mdButton**,  use `.md-button.md-default-theme`.  And if you have configured a custom theme called `companyX`, then the **fully-specified** classname should be `.md-button.md-companyX-theme.btn1`.

<br/>
<br/>
##Flat Buttons

#### Standard CSS 

Here is the snapshot of the rendered button components using the standard component CSS:

![mdbuttonflatdefault2](https://cloud.githubusercontent.com/assets/210413/7940929/925cf486-0919-11e5-9f4d-4a728297f38d.png)

##### Normal 

```html 
<md-button> Button </md-button> 
```
```css
.md-button.md-default-theme { 
  color : currentColor; # inherits current text color
}
```

##### Hover 

```css
.md-button.md-default-theme:not([disabled):hover { 
  background-color: rgba(158, 158, 158, 0.2);
}
```

##### Disabled 

```html 
<md-button disabled> Button </md-button> 
```
```css
.md-button.md-default-theme[disabled] { 
  color : rgba(0, 0, 0, 0.26);
  background-color: transparent;
}
```

<br/>

#### CSS Custom Overrides 

Let's create a **fully-specified** CSS style `.btn1` to override the standard mdButton styles (using the default theme):

```css
.md-button.md-default-theme.btn1            {  }  /* for <md-button class="btn1" /> */
.md-button.md-default-theme.md-primary.btn1 {  }  /* for <md-button class="md-primary btn1" /> */
.md-button.md-default-theme.md-accent.btn1  {  }  /* for <md-button class="md-accent btn1" /> */
.md-button.md-default-theme.md-warn.btn1    {  }  /* for <md-button class="md-warn btn1" /> */
```

Here is a snapshot of the rendered, customized mbButton components:

![mdbuttonflatdefault_overrides](https://cloud.githubusercontent.com/assets/210413/7941518/6a59a994-091d-11e5-82cb-14a9a278ce31.png)

##### Normal 

```html 
<md-button class="btn1"> Button </md-button> 
```
```css
.md-button.md-default-theme.btn1 { 
  color : rgb(49, 46, 46);
  background-color: rgba(255, 222, 121, 0.96);
  border-radius: 10px 0 0 10px;
  font-size: 16px;
}
```

##### Hover 

```css
.md-button.md-default-theme.btn1:not([disabled]):hover { 
  background-color: rgba(107, 103, 91, 0.96);
  color: white;
}
```

##### Disabled 

```html 
<md-button class="btn1" disabled> Button </md-button> 
```
```css
.md-button.md-default-theme.btn1[disabled] { 
  color : rgb(187, 187, 187);
  background-color: rgba(230, 230, 229, 0.96);
}
```

---
<br/>

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


Here is another example of a button with font icons:

```html
<md-button>
 <md-icon md-font-icon="icon-home" 
   ng-style="{color: 'green', 'font-size':'36px', height:'36px'}" >
 </md-icon>
</md-button>
```


![fonticonbutton](https://cloud.githubusercontent.com/assets/1292882/7670414/f57721ba-fcab-11e4-9a22-67970063797c.PNG)
