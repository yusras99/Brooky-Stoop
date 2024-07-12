function dropdownOnClick(dropdownContainer, dropdownMenu, className = 'show') {
  dropdownContainer.addEventListener('click', () => {
    dropdownMenu.classList.toggle(className)
  })

  dropdownContainer.addEventListener('mouseleave', () => {
    dropdownMenu.classList.remove(className)
  })
}

const dropdownContainers = document.querySelectorAll('.dropdown-share')
dropdownContainers.forEach((e) => {
  const dropdownChildren = [...e.children]

  for (let child of dropdownChildren) {
    if (child.classList.contains('dropdown-content')) {
      dropdownOnClick(e, child)
    }
  }
})
