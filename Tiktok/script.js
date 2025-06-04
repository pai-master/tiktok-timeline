const car = document.querySelector('.car');
const milestones = document.querySelectorAll('.milestone');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
const closeBtn = modal.querySelector('.close');

let currentIndex = 0;
let isZoomed = false;

// 移动端横屏提示功能
function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
         (window.innerWidth <= 768 && 'ontouchstart' in window);
}

function isPortrait() {
  return window.innerHeight > window.innerWidth;
}

function createLandscapePrompt() {
  // 先移除可能存在的旧提示
  const oldPrompt = document.getElementById('landscape-prompt');
  if (oldPrompt) {
    oldPrompt.remove();
  }

  const prompt = document.createElement('div');
  prompt.id = 'landscape-prompt';
  prompt.innerHTML = `
    <div class="landscape-prompt-content">
      <div class="rotate-icon">📱</div>
      <h3>获得最佳体验</h3>
      <p>请将设备旋转至横屏模式<br>以获得完整的交互体验</p>
      <button onclick="dismissLandscapePrompt()">我知道了</button>
    </div>
  `;
  
  // 添加样式
  const style = document.createElement('style');
  style.textContent = `
    #landscape-prompt {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh;
      background: rgba(0, 0, 0, 0.9);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: fadeInPrompt 0.5s ease;
    }
    
    .landscape-prompt-content {
      background: linear-gradient(145deg, #ffffff, #f5f5f5);
      padding: 20px;
      border-radius: 20px;
      text-align: center;
      width: 80%;
      max-width: 300px;
      margin: 20px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.3);
      animation: slideInPrompt 0.5s ease;
      position: relative;
      z-index: 10000;
    }
    
    .rotate-icon {
      font-size: 60px;
      margin-bottom: 20px;
      animation: rotateIcon 2s ease-in-out infinite;
    }
    
    .landscape-prompt-content h3 {
      color: #333;
      font-size: 24px;
      margin-bottom: 15px;
      font-weight: 700;
    }
    
    .landscape-prompt-content p {
      color: #666;
      font-size: 16px;
      line-height: 1.5;
      margin-bottom: 25px;
    }
    
    .landscape-prompt-content button {
      background: linear-gradient(45deg, #ff6b9d, #54a0ff);
      color: white;
      border: none;
      padding: 12px 30px;
      border-radius: 25px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    }
    
    .landscape-prompt-content button:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(0,0,0,0.3);
    }
    
    @keyframes fadeInPrompt {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes slideInPrompt {
      from { 
        transform: translateY(-50px) scale(0.9);
        opacity: 0;
      }
      to { 
        transform: translateY(0) scale(1);
        opacity: 1;
      }
    }
    
    @keyframes rotateIcon {
      0%, 100% { transform: rotate(0deg); }
      25% { transform: rotate(-15deg); }
      75% { transform: rotate(15deg); }
    }
  `;
  
  document.head.appendChild(style);
  document.body.appendChild(prompt);
}

function dismissLandscapePrompt() {
  const prompt = document.getElementById('landscape-prompt');
  if (prompt) {
    prompt.style.animation = 'fadeOutPrompt 0.3s ease forwards';
    setTimeout(() => {
      prompt.remove();
    }, 300);
  }
  
  // 添加淡出动画
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeOutPrompt {
      from { opacity: 1; }
      to { opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}

function checkOrientation() {
  if (isMobileDevice() && isPortrait()) {
    // 延迟显示提示，让页面先加载完成
    setTimeout(() => {
      if (!document.getElementById('landscape-prompt')) {
        createLandscapePrompt();
      }
    }, 1000);
  } else {
    // 如果已经是横屏或桌面端，移除提示
    const prompt = document.getElementById('landscape-prompt');
    if (prompt) {
      dismissLandscapePrompt();
    }
    // 确保页面在横屏时可见
    document.body.style.visibility = 'visible';
    document.body.style.backgroundColor = 'initial';
  }
}

// 在页面加载时添加初始样式并设置事件监听
document.addEventListener('DOMContentLoaded', () => {
  // 添加横屏媒体查询样式
  const style = document.createElement('style');
  style.textContent = `
    body {
      visibility: visible;
      background-color: initial;
      min-height: 100vh;
      margin: 0;
      padding: 0;
      overflow: hidden;
    }
    
    @media screen and (orientation: portrait) {
      body {
        visibility: hidden;
      }
      #landscape-prompt {
        visibility: visible !important;
      }
    }
    
    @media screen and (orientation: landscape) {
      body {
        visibility: visible !important;
        background-color: initial !important;
      }
      #landscape-prompt {
        display: none !important;
      }
    }
  `;
  document.head.appendChild(style);
  
  // 设置viewport meta标签
  let viewport = document.querySelector('meta[name="viewport"]');
  if (!viewport) {
    viewport = document.createElement('meta');
    viewport.name = 'viewport';
    document.head.appendChild(viewport);
  }
  viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
  
  // 检查初始方向
  checkOrientation();
  
  // 监听屏幕方向变化
  window.addEventListener('orientationchange', () => {
    // 方向改变时先隐藏内容防止闪烁
    document.body.style.visibility = 'hidden';
    setTimeout(() => {
      checkOrientation();
      document.body.style.visibility = 'visible';
    }, 300); // 延迟检查，等待方向变化完成
  });

  // 监听窗口大小变化（用于桌面端测试）
  window.addEventListener('resize', () => {
    setTimeout(checkOrientation, 100);
  });
});

// 全局函数，供HTML调用
window.dismissLandscapePrompt = dismissLandscapePrompt;

// 里程碑详细内容
const details = [
  {
    title: "On November 10, 2017",
    content: "ByteDance acquired Musical.ly. It spent nearly $1 billion to acquire the US short - video platform Musical.ly, which served as a gateway for ByteDance to enter the US market."
  },
  {
    title: "On August 2, 2018",
    content: "TikTok and Musical.ly were officially merged.ByteDance migrated 60 million North American users of Musical.ly to TikTok, marking the official launch of TikTok in the US."
  },
  {
    title: "On August 6, 2020",
    content: "Trump signed an executive order demanding the sale of TikTok.Citing 'national security' reasons, he required ByteDance to divest TikTok's US business within 45 days, or else it would be banned."
  },
  {
    title: "On September 19, 2020",
    content: "Oracle became the 'trusted technology provider'. TikTok announced a cooperation agreement with Oracle, proposing that Oracle would host US user data (the 'Texas Plan')."
  },
  {
    title: "On June 9, 2021",
    content: "Biden revoked Trump's executive order and instead imposed security reviews on foreign apps, temporarily alleviating TikTok's ban crisis."
  },
  {
    title: "On March 23, 2023",
    content: "CEO Zhou Shouzi attended a US congressional hearing. He was questioned by members of both parties for five hours, and the incident attracted global media attention."
  },
  {
    title: "On April 24, 2024",
    content: "the US Congress passed the 'Divestment Act', requiring ByteDance to sell TikTok's US business within 270 days, or else face a national ban. President Biden signed the act into law on the same day."
  },
  {
    title: "On May 7, 2024",
    content: "TikTok officially sued the US government, challenging the Divestment Act on the grounds of 'unconstitutionality', and the legal battle entered the judicial process. Will TikTok be able to pass this hurdle? The outcome is still in a stalemate."
  }
];

// 计算里程碑位置
function getMilestonePosition(index) {
  const milestone = milestones[index];
  const rect = milestone.getBoundingClientRect();
  const containerRect = milestone.parentElement.getBoundingClientRect();
  return {
    left: rect.left - containerRect.left + rect.width / 2,
    bottom: containerRect.height - (rect.top - containerRect.top) - rect.height / 2
  };
}

// 移动车辆到指定里程碑
function moveCarTo(index) {
  const milestone = milestones[index];
  if (!milestone) return;
  const container = milestone.parentElement;

  // 计算车辆新位置，只改变left，保持bottom固定
  const left = milestone.offsetLeft + milestone.offsetWidth / 2 - car.offsetWidth / 2;
  const bottom = parseFloat(getComputedStyle(car).bottom);

  car.style.transition = 'left 2s ease';
  car.style.left = left + 'px';
  car.style.bottom = bottom + 'px';

  car.classList.add('moving');

  // 动画结束后触发放大效果
  setTimeout(() => {
    car.classList.remove('moving');
    zoomToMilestone(index);
  }, 2000);
}

// 放大指定里程碑和道路区域
function zoomToMilestone(index) {
  if (isZoomed) return;
  isZoomed = true;

  const container = document.querySelector('.timeline-wrapper');
  const milestone = milestones[index];

  // 隐藏其他里程碑
  milestones.forEach((m, i) => {
    if (i !== index) {
      m.style.opacity = '0';
      m.style.pointerEvents = 'none';
    } else {
      m.style.transform = 'scale(1.3)';
      m.style.zIndex = '20';
    }
  });

  // 放大容器，聚焦当前里程碑
  const milestoneRect = milestone.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();

  const offsetX = containerRect.left - milestoneRect.left + containerRect.width / 2 - milestoneRect.width / 2;
  const offsetY = containerRect.top - milestoneRect.top + containerRect.height / 2 - milestoneRect.height / 2;

  container.style.transition = 'transform 0.5s ease';
  container.style.transformOrigin = 'center center';
  container.style.transform = `scale(2) translate(${offsetX / 2}px, ${offsetY / 2}px)`;

  // 显示弹窗
  showModal(index);
}

// 还原缩放和显示所有里程碑
function resetZoom() {
  if (!isZoomed) return;
  isZoomed = false;

  const container = document.querySelector('.timeline-wrapper');
  container.style.transform = 'none';

  milestones.forEach(m => {
    m.style.opacity = '1';
    m.style.pointerEvents = 'auto';
    m.style.transform = 'none';
    m.style.zIndex = '10';
  });
}

// 显示弹窗
function showModal(index) {
  modalTitle.textContent = details[index].title;
  modalBody.textContent = details[index].content;
  modal.style.display = 'block';
}

// 关闭弹窗
function closeModal() {
  modal.classList.add('closing');
  setTimeout(() => {
    modal.style.display = 'none';
    modal.classList.remove('closing');
    resetZoom();
  }, 400);
}

// 绑定事件
milestones.forEach((milestone, index) => {
  milestone.addEventListener('click', () => {
    currentIndex = index;
    moveCarTo(index);
  });
});

closeBtn.addEventListener('click', closeModal);

// 点击弹窗背景关闭弹窗
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

// 支持键盘关闭弹窗
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.style.display === 'block') {
    closeModal();
  }
});
