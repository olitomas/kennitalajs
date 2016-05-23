# Kennitalajs

Validation for an Icelandic kennitala (social security number)

Getting started:

```javascript

// Accepted types:
var type1 = 2202863399; //Integer
var type2 = '2202863399' //String
var type3 = '220286-3399' //String with the widely used hyphen

// Kennitala for a person (me):
var kennitala = new Kennitala(2202863399);
//console.log(kennitala) returns:
//{
//    valid: true, <----------- Tells us if the kennitala is valid
//    type: "person", <-------- Tells us if kennitala belongs to a person or a company
//    age: 22, <--------------- The person/company age in years
//    msAge: 694383374545, <--- Time in milliseconds since birth/company was founded
//    birthdayToday: true, <--- Tells us if the person/company has a birthday today
//    kt: 2202863399 <--------- The kennitala as a integer
//}


// Kennitala for a company:
var kennitala = new Kennitala('521110-0660');
//console.log(kennitala) returns:
//{
//    valid: true, <----------- Tells us if the kennitala is valid
//    type: "company", <------- Tells us if kennitala belongs to a person or a company
//    age: 5, <---------------- The person/company age in years
//    msAge: 174515150922, <--- Time in milliseconds since birth/company was founded
//    birthdayToday: true, <--- Tells us if the person/company has a birthday today
//    kt: 5211100660 <--------- The kennitala as a integer
//}

});
```