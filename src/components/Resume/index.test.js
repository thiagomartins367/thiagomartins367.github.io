import { act, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Resume from '.';
import data from '../../database/data.json';
import { SKILL_HIGHLIGHT_INTERVAL, SKILL_HIGHLIGHT_RESUME_DELAY } from './useSkillsHighlight';

const { skills } = data.professional;

const highlightedSkills = () => [...document.querySelectorAll('.skill-highlighted')]
  .map((skill) => skill.textContent);

const skillCard = (index) => document.querySelectorAll('.skill')[index].closest('a');

const advanceTime = (ms) => act(() => { jest.advanceTimersByTime(ms); });

beforeEach(() => {
  jest.useFakeTimers();
  // Simula a grade de skills visível na tela
  window.IntersectionObserver = class {
    constructor(callback) { this.callback = callback; }

    observe() { this.callback([{ isIntersecting: true }]); }

    disconnect() {}
  };
});

afterEach(() => {
  jest.useRealTimers();
  delete window.IntersectionObserver;
});

test('destaca as skills uma por vez, em loop', () => {
  render(<Resume />);
  expect(highlightedSkills()).toEqual([skills[0].title]);

  advanceTime(SKILL_HIGHLIGHT_INTERVAL);
  expect(highlightedSkills()).toEqual([skills[1].title]);

  advanceTime(SKILL_HIGHLIGHT_INTERVAL * (skills.length - 1));
  expect(highlightedSkills()).toEqual([skills[0].title]);
});

test('pausa com o mouse sobre um card e retoma 1 segundo após o mouse sair', () => {
  render(<Resume />);
  advanceTime(SKILL_HIGHLIGHT_INTERVAL);

  userEvent.hover(skillCard(5));
  expect(highlightedSkills()).toEqual([]);
  advanceTime(SKILL_HIGHLIGHT_INTERVAL * 3);
  expect(highlightedSkills()).toEqual([]);

  userEvent.unhover(skillCard(5));
  advanceTime(SKILL_HIGHLIGHT_RESUME_DELAY - 1);
  expect(highlightedSkills()).toEqual([]);

  advanceTime(1);
  expect(highlightedSkills()).toEqual([skills[1].title]);
});

test('continua pausado se o mouse entrar em outro card antes de 1 segundo', () => {
  render(<Resume />);

  userEvent.hover(skillCard(0));
  userEvent.unhover(skillCard(0));
  advanceTime(SKILL_HIGHLIGHT_RESUME_DELAY / 2);
  userEvent.hover(skillCard(1));
  advanceTime(SKILL_HIGHLIGHT_RESUME_DELAY * 2);

  expect(highlightedSkills()).toEqual([]);
});

test('não anima quando a grade de skills não está visível', () => {
  delete window.IntersectionObserver;
  render(<Resume />);
  advanceTime(SKILL_HIGHLIGHT_INTERVAL * 3);

  expect(highlightedSkills()).toEqual([]);
});
