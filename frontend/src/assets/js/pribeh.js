/**
 * pribeh.js — Story page (pribeh.html).
 * Loads content from pribeh.json.
 */

(function () {
    'use strict';

    function el(id) { return document.getElementById(id); }

    function createEl(tag, className, html) {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (html)      node.innerHTML = html;
        return node;
    }

    async function loadStory() {
        try {
            const res = await fetch('assets/data/pribeh.json');
            if (!res.ok) throw new Error(`pribeh.json → ${res.status}`);
            const d = await res.json();

            el('page-title').textContent    = d.pageHeader.title;
            el('page-subtitle').textContent = d.pageHeader.subtitle;

            el('story-title').textContent = d.storySection.title;
            const img = el('story-image');
            img.src = d.storySection.image;
            img.alt = d.storySection.imageAlt;
            d.storySection.paragraphs.forEach(p =>
                el('story-paragraphs').appendChild(createEl('p', null, p)));

            d.timelineSection.forEach(item =>
                el('timeline').appendChild(createEl('div', 'timeline-item', `
                    <div class="timeline-year">${item.year}</div>
                    <div class="timeline-content">
                        <h3>${item.title}</h3>
                        <p>${item.description}</p>
                    </div>`)));

            d.valuesSection.forEach(v =>
                el('values-grid').appendChild(createEl('div', 'value-card', `
                    <h3>${v.title}</h3><p>${v.description}</p>`)));

            d.teamSection.forEach(m =>
                el('team-grid').appendChild(createEl('div', 'team-member', `
                    <div class="team-image"><img src="${m.image}" alt="${m.alt}"></div>
                    <h3>${m.name}</h3>
                    <p class="team-role">${m.role}</p>
                    <p>${m.description}</p>`)));
        } catch (err) {
            console.error('loadStory:', err);
        }
    }

    document.addEventListener('DOMContentLoaded', loadStory);
})();
