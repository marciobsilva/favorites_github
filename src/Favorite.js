import { Github } from "./Github.js";

export class Favorite {
  constructor(root) {
    this.root = document.querySelector(root)

    let gitHubFavoriteExists = localStorage.getItem('@github-favorites:')
    if(!gitHubFavoriteExists) {
      localStorage.setItem('@github-favorites:', JSON.stringify([]))
    }

    this.load()
  }

  async save( username ) {
    try {
      const user = await Github.get(username);

      if(user.name === undefined) {
        throw new Error('Usuário não encontrado!')
      }

      let listUsers = JSON.parse(localStorage.getItem('@github-favorites:'))
      
      let existsUser = listUsers.filter( data => data.login === user.login)

      if(existsUser.length > 0) {
        throw new Error('Usuário já favoritado')
      }

      const newUsers = [user, ...listUsers]

      localStorage.setItem('@github-favorites:', JSON.stringify(newUsers))
    } catch (error) {
      alert( error.message )
    }
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
  }

  delete( user ) {
    const filteredEntries = JSON.parse(localStorage.getItem('@github-favorites:')).filter( entry => entry.login != user.login)

    localStorage.setItem('@github-favorites:', JSON.stringify(filteredEntries))

    this.update();
  }
}

export class FavoriteView extends Favorite{
  constructor(root) {
    super(root)

    this.tbody = this.root.querySelector('table tbody')

    this.update()
    this.onAdd()
  }

  onAdd() {
    const addButton = this.root.querySelector("#button-search");
    const searchInput = this.root.querySelector("#input-search");

    addButton.addEventListener('click', () => {
      this.search(searchInput.value)
      searchInput.value = ''
    })
  }

  update() {
    this.removeAllTr()

    const favorites = JSON.parse(localStorage.getItem('@github-favorites:'));

    console.log(favorites)

    favorites.forEach( user => {
      this.tbody.append(this.createRow(user))
    })
  }

  createRow( user ) {
    let tr = document.createElement('tr')

    tr.innerHTML = `
      <td class="user">
        <img src="https://www.github.com/${user.login}.png" alt="Imagem de márcio">
        <a href="https://www.github.com/${user.login}" target="_blank">
          <p>${user.name}</p>
          <span>${user.login}</span>
        </a>
      </td>
      <td class="repositories">${user.public_repos}</td>
      <td class="followers">${user.followers}</td>
      <td class="close"><button class="remove" data-login="${user.login}">&times;</button></td>
    `

    tr.querySelector('.remove').onclick = () => {
      const isOk = confirm('Deseja excluir esta linha?')

      if(isOk) {
        this.delete( user )
      }
    }

    return tr;
  }

  removeAllTr() {
    this.tbody.querySelectorAll('tr').forEach( (tr) => {
      tr.remove()
    })
  }

  async search( username ) {
    await this.save( username )
    this.update()
  }
}