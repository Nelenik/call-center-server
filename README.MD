# Server for development based on json-server
## Description
The server is based on [json-server](https://github.com/typicode/json-server/tree/v0?tab=readme-ov-file#module).

**To start server**
-   `npm install` - dependency installation
-   `npm run server` - server start

In addition to the features provided by **json-server**, this variant also implements basic authorization using an access token.
You can use a permanent token for development: `2078289c-73e5-4137-8ceb-96445633512c`, regular tokens can be obtained by user authorization, they live for 30 minutes.
The token is used in the ***Authorization*** header for all types of requests except the authentication request.

***Request example*** (all the expamples :
```js
	fetch('http://localhost:4000/users', {
		  method: "GET",
		  headers: {
		  "Content-Type": "application/json",
			"Authorization": "Bearer 2078289c-73e5-4137-8ceb-96445633512c"
		  }
	})
```
<span style="color: red"><b>Note:</b>  In all examples, the request is made to localhost. If the server is published on a hosting, it is necessary to substitute the corresponding domain</span>
`'http://yourdomain.com/users`

### API methods

#### POST:
- <b style="font-size: 1.2em">/auth/login</b>

For login, send username and password of the user in the body of the request

***Example:***
```js
	fetch("http://localhost:4000/auth/login", {
		method: "POST",
		headers: {
		"Content-Type": "application/json",
		},
		body: JSON.stringify({
		username: "manager01",
		password: "manager01",
		}),
});
```
<details >
	<summary style="cursor: pointer; color: rgba(59, 130, 246)"><b>Currently available users to login (expand) 🡓</b></summary>
	<code>
	[{  username: "manager01",
	password: "manager01"}, 
	{username: "agent01",
	password: "agent007",}, 
	{username: "roughhatch",
	password: "agent02",}, 
	{username: "saxcruciatus",
	password: "agent03",},
	{username: "filizabra",
	password: "agent04",}, 
	{username: "organiccarpenter",
	password: "agent05",}, 
	{username: "hoipolloiswindler",
	password: "agent06",}, 
	{username: "manager02",
	password: "manager02",}]
	</code>
</details>
In the response, we get an object with a token that can be used for further requests: 
`{"accesToken": "8000381c-cea2-45c2-8bdb-9b77c99e503c"}`

- <b style="font-size: 1.2em">/auth/logout</b>

***Example:***

```js
	fetch("http://localhost:4000/auth/logout", {
		method: "POST",
		headers: {
		"Content-Type": "application/json",
		"Authorization": "Bearer 2078289c-73e5-4137-8ceb-96445633512c"
		}
});
```
- <b style="font-size: 1.2em">/users</b>

***Example:***

```js
	fetch("http://localhost:4000/users", {
		method: "POST",
		headers: {
		"Content-Type": "application/json",
		"Authorization": "Bearer 2078289c-73e5-4137-8ceb-96445633512c"
		},
		body: JSON.strinigify({
			"username": "manager01",
			"password": "manager01",
			"email": "lachelle.faudree@mail.com",
			"role": "manager",
			"employeeId": "f9d9cea1263da0faaf040d61991a3c16",
		})
});
```
In response, we get the object of the created user

- <b style="font-size: 1.2em">/employees</b>
- <b style="font-size: 1.2em">/clients</b>
- <b style="font-size: 1.2em">/calls</b>

Post requests to `/employees`, `/clients`, `/calls` have the same behavior

#### PUT, PATCH, DELETE 
- <b style="font-size: 1.2em">/users/:id</b>
- <b style="font-size: 1.2em">/employees/:id</b>
- <b style="font-size: 1.2em">/clients/:id</b>
- <b style="font-size: 1.2em">/calls/:id</b>

These methods remove/modify specific data by ***id***

***Example:***

```js
	fetch("http://localhost:4000/users/ZIv4sAL", {
		method: "PATCH",
		headers: {
		"Content-Type": "application/json",
		"Authorization": "Bearer 2078289c-73e5-4137-8ceb-96445633512c"
		},
		body: JSON.strinigify({
			"email": "new-email@mail.com",
		})
});
```

#### GET
Getting the profile of an authorized user
- <b style="font-size: 1.2em">/auth/profile</b>
Response: `Profile` (see schema)

***Example:***
```js
	fetch("http://localhost:4000/auth/profile", {
		method: "GET",
		headers: {
		"Content-Type": "application/json",
		"Authorization": "Bearer 2078289c-73e5-4137-8ceb-96445633512c"
		}
});
```
Getting arrays of all users, employees, clients, and calls
- <b style="font-size: 1.2em">/users</b>
Response: `User[]` (see schema)
- <b style="font-size: 1.2em">/employees</b>
Response: `Employee[]` (see schema)
- <b style="font-size: 1.2em">/clients</b>
Response: `Client[]` (see schema)
- <b style="font-size: 1.2em">/calls</b>
Response: `Call[]` (see schema)

Getting a specific user, employee, customer, and call object
- <b style="font-size: 1.2em">/users/:id</b> 
Response: `User` (see schema)
- <b style="font-size: 1.2em">/employees/:id</b>
Response: `Employee` (see schema)
- <b style="font-size: 1.2em">/clients/:id</b>
Response: `Client` (see schema)
- <b style="font-size: 1.2em">/calls/:id</b>
Response: `Call` (see schema)

Getting an array of calls made by a specific operator. Response: `Call[]` (see schema)

- <b style="font-size: 1.2em">/calls/:employeeId</b>

### Schemas
#### Profile:
```typescript
	interface Profile {
		auth_data: {
		id: string,
		username: string,
		email: string,
		role: string,
		employeeId: string,
		createdAt: string,
		updatedAt: string
	  },
	  employee_data: {
		id: string,
		name:string,
		age: number,
		image: string,
		contacts: {
		  phone: string,
		  email: string
		},
		languages: string[]
		gender:  'male'|'female',
		position: string,
		status: "free"|"on-break"|"busy",
		createdAt: string,
		updatedAt: string
	  }
	}
```
#### LoginResponse:
```typescript
 interface LoginResponse{
	 accesToken: string, 
	 userId: string,
	 employeeId: string, 
	 role: "manager"|"agent"
 }
```

#### User:

```typescript
interface User{
	id: string,
	username: string,
	password: string,
	email: string,
	role: string,
	employeeId: string,
	createdAt: string,
	updatedAt: string,
}
```

#### Employee:

```typescript
interface Employee{
	id: string,
	name: string,
	age: number,
	image: string,
	contacts: {
	phone: string,
	email: string,
	},
	languages: string[],
	gender: 'male'|'female',
	position: string,
	status: "free"|"on-break"|"busy",
	createdAt: string,
	updatedAt: string
}
```

#### Client:
```typescript
 interface Client{
        id: string,
        firstName: string,
        lastName: string,
        age: number,
        gender: 'male'|'female',
        image: string,
        contacts: {
            phone: string,
            email: string,
        },
        notes: string[],
        interactionsCount: number,
        lastInteractionDate: string,
        createdAt: string,
        status: 'new'|'VIP'|'active'|'inactive'|'problematic',
        updatedAt: string,
    }
```
#### Call
```typescript
 interface Call {
        id: string,
        type: 'outgoing'|'incoming',
        state: 'accepted'|'missed',
        status: 'completed_success'| 'completed_refuse'| 'callback'|'transfer',
        callMood: 'positive'| 'negative'| 'neutral',
        agentComment: string,
        feedbackScore: number,
        followUpRequired: boolean,
        recordUrl: string,
        clientId: string,
        employeeId: string,
        start: string,
        end: string,
        duration: number,
    }
```
