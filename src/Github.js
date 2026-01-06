export class Github {
  static get(username) {
    return fetch(`https://api.github.com/users/${username}`)
      .then(data => data.json())
      .then( ({ name, login, public_repos, followers }) => ({ 
        name, 
        login, 
        public_repos, 
        followers 
      }))
  }
}