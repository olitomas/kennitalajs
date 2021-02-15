# Kennitalajs

Validation for an Icelandic kennitala (social security number)

### Getting started:

#### Install with npm (npm install kennitalajs) or:

```html
<script type="text/javascript" src="https://unpkg.com/kennitalajs@latest/kennitala.min.js"></script>

<script type="text/javascript">
    var test = new Kennitala(2202863399);

    console.log(test);
</script>
```

### Accepted types:

```javascript
//Kennitalajs accepts all types of possible kt formats
var type1 = 2202863399; //Integer
var type2 = '2202863399'; //String
var type3 = '220286-3399'; //String with the widely used hyphen

// I do however reccommend storing the kennitala in a string format since integers cant start with a zero
```

### Validating a persons kennitala

```javascript
var kennitala = new Kennitala(2202863399);
//kennitala returns:
{
    valid: true, //<----------- Tells us if the kennitala is valid
    type: 'person', //<-------- Tells us if kennitala belongs to a person or a company
    age: 22, //<--------------- The person/company age in years
    msAge: 694383374545, //<--- Time in milliseconds since birth/company was founded
    birthdayToday: true, //<--- Tells us if the person/company has a birthday today
    kt: 2202863399 //<--------- The kennitala as a integer
};
```

### Validating a company kennitala

```javascript
var kennitala = new Kennitala('521110-0660');
//kennitala returns:
{
    valid: true,
    type: 'company',
    age: 5,
    msAge: 174515150922,
    birthdayToday: true,
    kt: 5211100660
};
```

### Create a fake (but valid) kennitala

```javascript
var kennitala = new Kennitala('fake');
//kennitala returns:
{
    valid: true,
    ......
};
```

### Invalid date examples

We can recieve 5 possible reasons for when the kennitala is not valid:

#### Kennitala can be too short

```javascript
var kennitala = new Kennitala(22028633);

//kennitala returns:
{
    valid: false,
    reason: 'Kennitala is too short',
    errorCode: 1
};
```

#### Something is wrong with digits 1 and 2

**XX**xxxxxxxx:

```javascript
var kennitala = new Kennitala(3202863399);

kennitala returns:
{
    valid: false,
    reason: 'Birthdate is out of range (digits 1 and 2)',
    errorCode: 2
};
```

#### Something is wrong with digits 3 and 4

xx**XX**xxxxxx

```javascript
var kennitala = new Kennitala(2222863399);
//kennitala returns:
{
    valid: false,
    reason: 'Month digits are out of range (digits 3 and 4)',
    errorCode: 3
};
```

---

xxxx**XXX**xxx
Digits 5,6,7 and 8 can be anything so we cant validate them

---

#### Something is wrong with digit number 9

xxxxxxxx**X**x

```javascript
var kennitala = new Kennitala(2202863349);
//kennitala returns:
{
  valid: false,
    reason: 'Digit 9 is not valid. Read about "Níundi stafurinn" here: https://is.wikipedia.org/wiki/Kennitala',
    errorCode: 4
};

```

#### Something is wrong with digit number 10

xxxxxxxxx**X**

```javascript
//
var kennitala = new Kennitala(2202863393);

//kennitala returns:
{
    valid: false,
    reason: 'Century digit out of range (digit 10)',
    errorCode: 5
};

```
