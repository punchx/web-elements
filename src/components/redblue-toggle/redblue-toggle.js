export default class RedBlueToggle {
  constructor(root) {
    this.root = root;
    this.eventHandler = () => {
      this.toggle();
    };
    this.initialize();
  }

  get toggled() {
    return this.root.getAttribute('aria-pressed') === 'true';
  }

  set toggled(toggled) {
    this.root.setAttribute('aria-pressed', String(toggled));
    const colorElem = this.root.querySelector('.redblue-toggle__color');
    let textColor;
    if (toggled) {
      textColor = 'Red';
      this.root.classList.add('redblue-toggle--toggled');
    } else {
      textColor = 'Blue';
      this.root.classList.remove('redblue-toggle--toggled');
    }
    colorElem.textContent = textColor;
  }

  initialize() {
    this.root.addEventListener('click', this.eventHandler);
  }

  destroy() {
    this.root.removeEventListener('click', this.eventHandler);
  }

  toggle() {
    this.toggled = !this.toggled;
  }
}
