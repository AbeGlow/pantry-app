export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.REACT_APP_ANTHROPIC_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(req.body),
  });

  const data = await response.json();
  res.status(200).json(data);
}
```

Save it as `claude.js` inside a new folder called `api` inside your `pantry-app` folder. So the path should be:
```
~/Desktop/pantry-app/api/claude.js
```

Then in `App.js` find:
```
https://api.anthropic.com/v1/messages
```

Replace it with:
```
/api/claude