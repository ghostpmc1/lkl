/**
 * ==========================================================================
 * ШКОЛЬНЫЙ ПРОЕКТ СОР-1: АКТИВНЫЙ ГРАЖДАНИН (9 КЛАСС)
 * Чистый клиентский JavaScript: Опрос, Графики, Редактор команды
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------------------------
     1. ДАННЫЕ ОПРОСА И ВИЗУАЛИЗАЦИЯ
     -------------------------------------------------------------------------- */
  const SURVEY_QUESTIONS = [
    {
      q: "Выбрасываете ли вы мусор строго в урну, даже если до неё нужно пройти расстояние?",
      labels: ["Да, всегда", "Иногда, если урны нет рядом", "Редко обращаю внимание"]
    },
    {
      q: "Замечали ли вы скопление мусора и пластика во дворе школы или в махалле?",
      labels: ["Да, постоянно вижу", "Иногда, в ветреные дни", "Нет, везде чисто"]
    },
    {
      q: "Знаете ли вы, что ст. 62 Конституции РУз обязывает беречь природу, а ст. 91-1 КоАО налагает штраф за мусор?",
      labels: ["Да, хорошо знаю закон", "Слышал(а), но смутно", "Нет, узнал(а) только сейчас"]
    },
    {
      q: "Делаете ли вы тактичное замечание сверстникам, если видите, что они бросают мусор на землю?",
      labels: ["Да, всегда делаю замечание", "Иногда хочу, но стесняюсь", "Нет, это не моё дело"]
    },
    {
      q: "Готовы ли вы лично сортировать пластик и макулатуру, если в школе установят раздельные экобоксы?",
      labels: ["Да, с удовольствием готов(а)", "Возможно, если будет удобно", "Нет, не хочу тратить время"]
    },
    {
      q: "Согласны ли вы с тем, что поддержание чистоты — общая гражданская обязанность, а не только уборщиков?",
      labels: ["Полностью согласен(на)", "Частично согласен(на)", "Не согласен(на)"]
    }
  ];

  // Данные опроса (30 учащихся 9 классов)
  const surveyData = [
    [18, 9, 3],  // Q1
    [24, 5, 1],  // Q2
    [13, 10, 7], // Q3
    [7, 12, 11], // Q4
    [22, 6, 2],  // Q5
    [21, 6, 3]   // Q6
  ];

  function getPercent(qIdx, optIdx) {
    const total = surveyData[qIdx].reduce((a, b) => a + b, 0);
    return total ? Math.round((surveyData[qIdx][optIdx] / total) * 100) : 0;
  }

  // Отрисовка процентных полос
  const barsContainer = document.getElementById('surveyBarsContainer');
  function renderBars() {
    if (!barsContainer) return;

    barsContainer.innerHTML = SURVEY_QUESTIONS.map((item, i) => {
      const pYes = getPercent(i, 0);
      const pPart = getPercent(i, 1);
      const pNo = getPercent(i, 2);

      return `
        <div class="result-bar-card">
          <div class="bar-q-title"><strong>№${i + 1}.</strong> ${item.q}</div>
          <div class="progress-track">
            <div class="seg-yes" style="width: ${pYes}%;" title="${item.labels[0]}: ${pYes}%">${pYes >= 8 ? pYes + '%' : ''}</div>
            <div class="seg-part" style="width: ${pPart}%;" title="${item.labels[1]}: ${pPart}%">${pPart >= 8 ? pPart + '%' : ''}</div>
            <div class="seg-no" style="width: ${pNo}%;" title="${item.labels[2]}: ${pNo}%">${pNo >= 8 ? pNo + '%' : ''}</div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Круговая Canvas диаграмма
  const pieCanvas = document.getElementById('surveyPieChart');
  const pieSelect = document.getElementById('qSelectForPie');
  const pieCenterPct = document.getElementById('pieCenterPct');
  const pieCenterText = document.getElementById('pieCenterText');
  const pieLegendDetails = document.getElementById('pieLegendDetails');

  function renderPieChart() {
    if (!pieCanvas || !pieCanvas.getContext) return;
    const ctx = pieCanvas.getContext('2d');
    const qIdx = parseInt(pieSelect ? pieSelect.value : 2) || 0;

    const values = surveyData[qIdx];
    const total = values.reduce((a, b) => a + b, 0);

    const colors = ['#10b981', '#f59e0b', '#f43f5e'];
    const pYes = total ? Math.round((values[0] / total) * 100) : 0;
    const pPart = total ? Math.round((values[1] / total) * 100) : 0;
    const pNo = total ? Math.round((values[2] / total) * 100) : 0;

    const dpr = window.devicePixelRatio || 1;
    const width = 280;
    const height = 280;
    pieCanvas.width = width * dpr;
    pieCanvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 105;
    const innerRadius = 68;

    let startAngle = -Math.PI / 2;

    values.forEach((val, idx) => {
      const sliceAngle = (val / total) * 2 * Math.PI;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
      ctx.arc(centerX, centerY, innerRadius, startAngle + sliceAngle, startAngle, true);
      ctx.closePath();
      ctx.fillStyle = colors[idx];
      ctx.fill();
      startAngle += sliceAngle;
    });

    if (pieCenterPct) pieCenterPct.textContent = `${pYes}%`;
    if (pieCenterText) pieCenterText.textContent = SURVEY_QUESTIONS[qIdx].labels[0].split(' ')[0];

    if (pieLegendDetails) {
      pieLegendDetails.innerHTML = `
        <div class="pie-break-row" style="border-left: 3px solid ${colors[0]}">
          <span>${SURVEY_QUESTIONS[qIdx].labels[0]}</span>
          <strong>${pYes}% (${values[0]} чел.)</strong>
        </div>
        <div class="pie-break-row" style="border-left: 3px solid ${colors[1]}">
          <span>${SURVEY_QUESTIONS[qIdx].labels[1]}</span>
          <strong>${pPart}% (${values[1]} чел.)</strong>
        </div>
        <div class="pie-break-row" style="border-left: 3px solid ${colors[2]}">
          <span>${SURVEY_QUESTIONS[qIdx].labels[2]}</span>
          <strong>${pNo}% (${values[2]} чел.)</strong>
        </div>
      `;
    }
  }

  // Человеческие выводы
  const conclusionsBox = document.getElementById('dynamicConclusions');
  function renderConclusions() {
    if (!conclusionsBox) return;

    conclusionsBox.innerHTML = `
      <div class="concl-card">
        <span class="concl-num">Вывод 1 • Желание действовать</span>
        <h5 class="concl-heading">73% ребят готовы сортировать мусор</h5>
        <p class="concl-text">Ученики хотят видеть школу чистой, но им некуда выбрасывать пластик и бумагу раздельно. Нужны простые и понятные экобоксы.</p>
      </div>

      <div class="concl-card warn">
        <span class="concl-num">Вывод 2 • Стеснение и молчание</span>
        <h5 class="concl-heading">Только 23% делают замечания</h5>
        <p class="concl-text">Большинство ребят стесняются сказать сверстникам: «Не бросай на землю». Важно воспитывать спокойную гражданскую смелость.</p>
      </div>

      <div class="concl-card">
        <span class="concl-num">Вывод 3 • Правовая грамотность</span>
        <h5 class="concl-heading">Многие не знают статью 62 Конституции РУз</h5>
        <p class="concl-text">Школьники не воспринимают чистоту как обязанность по закону. Нужны короткие и живые разъяснения на классных часах.</p>
      </div>

      <div class="concl-card warn">
        <span class="concl-num">Вывод 4 • Масштаб проблемы</span>
        <h5 class="concl-heading">80% видят мусор каждый день</h5>
        <p class="concl-text">Проблема очевидна каждому. Ситуацию нельзя оставлять только техперсоналу — нужно включаться самим.</p>
      </div>
    `;
  }

  if (pieSelect) {
    pieSelect.addEventListener('change', renderPieChart);
  }

  renderBars();
  renderPieChart();
  renderConclusions();





  /* --------------------------------------------------------------------------
     3. МОБИЛЬНОЕ МЕНЮ И НАВИГАЦИЯ
     -------------------------------------------------------------------------- */
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });

    navMenu.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }

  // ScrollSpy для активной ссылки в меню
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-menu .nav-item');

  window.addEventListener('scroll', () => {
    let currentId = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) {
        currentId = sec.getAttribute('id');
      }
    });

    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${currentId}`) {
        item.classList.add('active');
      }
    });
  });

});
