(() => {
  const navigation = document.querySelector('.site-navigation');
  const toc = document.getElementById('page-toc');
  if (!navigation || !toc) return;

  const desktop = window.matchMedia('(min-width: 1001px)');
  const updateMenu = () => { navigation.open = desktop.matches; };
  updateMenu();
  desktop.addEventListener('change', updateMenu);

  const pageTitle = document.querySelector('.shell header h1').textContent.trim();
  const headings = Array.from(document.querySelectorAll(
    '#main_content h1[id], #main_content h2[id], #main_content h3[id]'
  )).filter(heading => heading.id !== 'table-of-contents' && heading.textContent.trim() !== pageTitle);

  if (!headings.length) return;

  const topLevel = Math.min(...headings.map(heading => Number(heading.tagName.slice(1))));
  const list = toc.querySelector('ul');
  headings.forEach(heading => {
    const item = document.createElement('li');
    item.style.setProperty('--heading-depth', Number(heading.tagName.slice(1)) - topLevel);
    const link = document.createElement('a');
    link.href = `#${encodeURIComponent(heading.id)}`;
    link.textContent = heading.textContent.trim();
    item.appendChild(link);
    list.appendChild(item);
  });
  toc.hidden = false;

  // Free up the small-screen viewport after choosing a section.
  list.addEventListener('click', event => {
    if (event.target.closest('a') && !desktop.matches) navigation.open = false;
  });
})();
