# Titles

Titles can be added to the valueWrapper, itemWrapper, groupWrapper or groupsWrapper. You can either add a single string value like "Title1" or and array of strings like ["Title1", "Title2"] which will be combined into a wrapper object.

As a special you can add html code to the titles as well. So feel free to configure something like:

```json5
valueTitle="<div class=\"mytitles\"><span>Title1</span></span>Title2</span></div>"
```

This will add a "div" object with class "mytitles" to the value object. The div contains two "span" objects. One with content "Title1" and one with "Title2".
