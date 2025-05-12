// グローバル変数の設定
//全てのスコープからアクセスできるようにする
let scene, camera, renderer, controls;
let raycaster, mouse;
let nodes = [];
let clock = new THREE.Clock();
let elapsedTime = 0;
let discoveredNodes = 0;
let allNodes = 0;
let isMobile = false;
let celebrationComplete = false;
let explosionPoint = new THREE.Vector3(0, 0, 0); // 爆発の中心点

// DOM要素
// HTMLやXMLドキュメントなどのマークアップ言語と、CSSをJavaScriptなどのプログラミング言語からアクセスできるようにする
const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');
const loadingScreen = document.getElementById('loadingScreen');
const progressBar = document.getElementById('progressBar');
const loadingText = document.getElementById('loadingText');
const infoPanel = document.getElementById('infoPanel');
const panelContent = document.getElementById('panelContent');
const panelClose = document.getElementById('panelClose');
const helpTooltip = document.getElementById('helpTooltip');
const timeDisplay = document.getElementById('timeDisplay');
const nodeTooltip = document.getElementById('nodeTooltip');
const discoveryCount = document.getElementById('discoveryCount');
const totalNodes = document.getElementById('totalNodes');
const discoveryProgress = document.getElementById('discoveryProgress');
const nextStageButton = document.getElementById('nextStageButton');
const thankYouContainer = document.getElementById('thankYouContainer');

// モバイル検出
function detectMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;

// 星空の作成
function createStars() {
  const starsGeometry = new THREE.BufferGeometry();
  const starsMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.5,
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true
  
// すべて発見した時のお祝いエフェクト (最終版)
function createCelebrationEffect() {
  celebrationComplete = true;
  
  // コントロールを一時的に無効化
  controls.enabled = false;
  
  // 1. すべてのノードを中央に集める - さらに短縮
  const timeline = gsap.timeline();
  
  // 中心点を設定（少し下方向に設定してカメラが見下ろす感じになるように）
  explosionPoint = new THREE.Vector3(0, -1, 0);
  
  // カメラが爆発点を見るように位置調整 - 速度アップ
  timeline.to(camera.position, {
    x: 0,
    y: 5, // 少し上から見下ろす
    z: 12,
    duration: 0.8, // 1.2→0.8に短縮
    ease: "power2.inOut"
  
// アニメーションループ
function animate() {
  requestAnimationFrame(animate);
  
  // 経過時間の更新
  elapsedTime = clock.getElapsedTime();
  
  // コントロールの更新
  controls.update();
  
  // 時間表示の更新
  updateTimeDisplay();
  
  // ノードのアニメーション
  animateNodes();
  
  // レンダリング
  renderer.render(scene, camera);
}

// 時間表示の更新
function updateTimeDisplay() {
  const date = new Date();
  const timeString = date.toLocaleTimeString();
  timeDisplay.textContent = `${timeString} | 経過時間: ${Math.floor(elapsedTime)}秒`;
}

// ノードのアニメーション
// 3Dシーン内に存在するオブジェクトのアニメーション
function animateNodes() {
  nodes.forEach(node => {
    if (!node.visible) return;
    
    // 時間経過に基づいて位置を変化させる
    const pulseSpeed = node.userData.pulseSpeed;
    const amplitude = node.userData.amplitude;
    const originalPos = node.userData.originalPosition;
    
    node.position.x = originalPos.x + Math.sin(elapsedTime * pulseSpeed) * amplitude;
    node.position.y = originalPos.y + Math.cos(elapsedTime * pulseSpeed * 0.7) * amplitude;
    node.position.z = originalPos.z + Math.sin(elapsedTime * pulseSpeed * 0.5) * amplitude;
    
    // シェーダーの時間更新
    //3DCGにおいて、画面に表示されるオブジェクトの見た目、つまり陰影や質感、色合いなどを制御するプログラム
    node.material.uniforms.time.value = elapsedTime;
  });
}

// ローディング処理の画面(開始時)
function simulateLoading() {
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 10;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      
      // ローディング完了処理
      loadingText.textContent = 'ロード完了 - 3D空間に入ります...';
      
      setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
          loadingScreen.style.display = 'none';
          
          // カーソルとイベントの設定
          setupCursor();
          
          // Three.js の初期化
          init();
        }, 1000);
      }, 500);
    }
    
    // プログレスバーの更新
    progressBar.style.width = progress + '%';
    
    // ローディングメッセージの更新
    if (progress < 30) {
      loadingText.textContent = '3D空間を生成中...';
    } else if (progress < 60) {
      loadingText.textContent = '情報ノードを配置中...';
    } else if (progress < 90) {
      loadingText.textContent = '接続を構築中...';
    } else {
      loadingText.textContent = '最終調整中...';
    }
  }, 200);
}

// パネル閉じるボタンの設定
panelClose.addEventListener('click', () => {
  infoPanel.classList.remove('active');
});

// ページ読み込み時の処理
window.onload = function() {
  // ローディングシミュレーション開始
  simulateLoading();
};);
  
  timeline.to(controls.target, {
    x: explosionPoint.x,
    y: explosionPoint.y,
    z: explosionPoint.z,
    duration: 0.4, // 0.8→0.4に短縮
    ease: "power2.inOut",
    onUpdate: function() {
      controls.update();
    }
  }, "-=0.8");
  
  // ノードを中央に集める - 大幅に速度アップ
  nodes.forEach((node, index) => {
    timeline.to(node.position, {
      x: explosionPoint.x,
      y: explosionPoint.y,
      z: explosionPoint.z,
      duration: 0.5, // 0.8→0.5に短縮
      ease: "power3.inOut",
      delay: index * 0.02 // 0.04→0.02に短縮
    }, "-=0.5");
    
    // 色を黄色に変更
    timeline.to(node.material.uniforms.color.value, {
      r: 1,
      g: 0.8,
      b: 0,
      duration: 0.3 // 0.6→0.3に短縮
    }, "-=0.5");
  });
  
  // 2. 弾ける直前にカメラをアップ
  timeline.to(camera.position, {
    x: 0,
    y: 3, // より直近に
    z: 8,
    duration: 0.3, // 0.5→0.3に短縮
    ease: "power1.in",
    onComplete: function() {
      // カメラが向いていることを確認
      camera.lookAt(explosionPoint);
    }
  });
  
  // 3. 弾けるエフェクト
  timeline.to({}, {
    duration: 0.1,
    onComplete: function() {
      // ノードをいったん非表示
      nodes.forEach(node => {
        node.visible = false;
      });
      
      // 爆発パーティクルの作成 - 超強化版
      createExplosionParticles();
      
      // "Thank you!!" テキストの表示 - HTML/CSS版
      setTimeout(() => {
        showThankYouMessage();
      }, 100); // 時間短縮
    }
  });
  
  // 4. "Thank you!!" テキスト表示中
  timeline.to({}, {
    duration: 2.5, // 表示時間
    onComplete: function() {
      // ノードを再配置
      randomizeNodes();
      
      // Thank youメッセージを非表示
      hideThankYouMessage();
      
      // 通常のカメラ位置に戻す
      gsap.to(camera.position, {
        x: 0,
        y: 0,
        z: 15,
        duration: 1.2, // 1.5→1.2に短縮
        ease: "power2.inOut"
      });
      
      gsap.to(controls.target, {
        x: 0,
        y: 0,
        z: 0,
        duration: 1.2, // 1.5→1.2に短縮
        ease: "power2.inOut",
        onUpdate: function() {
          controls.update();
        }
      });
    }
  });
  
  // 5. "次のステージに進む" ボタンを表示
  timeline.to({}, {
    duration: 0.6, // 0.8→0.6に短縮
    onComplete: function() {
      // ボタンの表示
      nextStageButton.classList.add('visible');
      
      // コントロールを再度有効化
      controls.enabled = true;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.5;
    }
  });
}

// Thank Youメッセージの表示 (HTML/CSS版)
function showThankYouMessage() {
  thankYouContainer.classList.add('visible');
}

// Thank Youメッセージの非表示
function hideThankYouMessage() {
  thankYouContainer.classList.remove('visible');
}

// 爆発パーティクル生成 (超強化版)
function createExplosionParticles() {
  const particlesCount = 700; // 400→700にさらに増加
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesMaterial = new THREE.PointsMaterial({
    color: 0xffdd00,
    size: 0.6, // 0.4→0.6にさらに大きく
    transparent: true,
    opacity: 1,
    sizeAttenuation: true
  });
  
  const positions = [];
  const velocities = [];
  
  for (let i = 0; i < particlesCount; i++) {
    // 初期位置は爆発点
    positions.push(explosionPoint.x, explosionPoint.y, explosionPoint.z);
    
    // ランダムな方向への速度
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    const speed = 6 + Math.random() * 10; // 4-10→6-16にさらに速度アップ
    
    const vx = Math.sin(phi) * Math.cos(theta) * speed;
    const vy = Math.sin(phi) * Math.sin(theta) * speed;
    const vz = Math.cos(phi) * speed;
    
    velocities.push(vx, vy, vz);
  }
  
  particlesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  const particles = new THREE.Points(particlesGeometry, particlesMaterial);
  particles.userData.velocities = velocities;
  particles.userData.animationStart = elapsedTime;
  
  scene.add(particles);
  
  // 追加：きらめきエフェクト用の小さなパーティクル
  const sparklesCount = 300; // 200→300に増加
  const sparklesGeometry = new THREE.BufferGeometry();
  const sparklesMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.3, // 0.2→0.3に大きく
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true
  });
  
  const sparklePositions = [];
  const sparkleVelocities = [];
  
  for (let i = 0; i < sparklesCount; i++) {
    // 初期位置は爆発点
    sparklePositions.push(explosionPoint.x, explosionPoint.y, explosionPoint.z);
    
    // ランダムな方向への速度
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    const speed = 5 + Math.random() * 8; // 3-8→5-13に速度アップ
    
    const vx = Math.sin(phi) * Math.cos(theta) * speed;
    const vy = Math.sin(phi) * Math.sin(theta) * speed;
    const vz = Math.cos(phi) * speed;
    
    sparkleVelocities.push(vx, vy, vz);
  }
  
  sparklesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(sparklePositions, 3));
  const sparkles = new THREE.Points(sparklesGeometry, sparklesMaterial);
  sparkles.userData.velocities = sparkleVelocities;
  sparkles.userData.animationStart = elapsedTime;
  
  scene.add(sparkles);
  
  // 追加：大きな光球エフェクト
  const glowSphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
  const glowSphereMaterial = new THREE.MeshBasicMaterial({
    color: 0xffdd00,
    transparent: true,
    opacity: 0.7
  });
  const glowSphere = new THREE.Mesh(glowSphereGeometry, glowSphereMaterial);
  glowSphere.position.copy(explosionPoint);
  scene.add(glowSphere);
  
  // 光球のアニメーション
  gsap.to(glowSphere.scale, {
    x: 50,
    y: 50,
    z: 50,
    duration: 1,
    ease: "power2.out",
    onComplete: () => {
      // 徐々に消す
      gsap.to(glowSphereMaterial, {
        opacity: 0,
        duration: 1.5,
        onComplete: () => {
          scene.remove(glowSphere);
        }
      });
    }
  });
  
  // パーティクルアニメーションを管理
  const animateParticles = () => {
    const positions = particles.geometry.attributes.position.array;
    const velocities = particles.userData.velocities;
    const animationDuration = 3.0; // 2.5→3.0に延長
    const timeSinceStart = elapsedTime - particles.userData.animationStart;
    
    if (timeSinceStart > animationDuration) {
      // アニメーション終了したらパーティクルを削除
      scene.remove(particles);
      scene.remove(sparkles);
      return;
    }
    
    // パーティクルの位置を更新
    for (let i = 0; i < positions.length; i += 3) {
      positions[i] += velocities[i] * 0.04; // 0.03→0.04に速度アップ
      positions[i + 1] += velocities[i + 1] * 0.04;
      positions[i + 2] += velocities[i + 2] * 0.04;
      
      // 時間経過で速度を落とす - より自然な動き
      velocities[i] *= 0.985;
      velocities[i + 1] *= 0.985;
      velocities[i + 2] *= 0.985;
    }
    
    // スパークルも更新
    const sparklePositions = sparkles.geometry.attributes.position.array;
    const sparkleVelocities = sparkles.userData.velocities;
    
    for (let i = 0; i < sparklePositions.length; i += 3) {
      sparklePositions[i] += sparkleVelocities[i] * 0.05;
      sparklePositions[i + 1] += sparkleVelocities[i + 1] * 0.05;
      sparklePositions[i + 2] += sparkleVelocities[i + 2] * 0.05;
      
      sparkleVelocities[i] *= 0.98;
      sparkleVelocities[i + 1] *= 0.98;
      sparkleVelocities[i + 2] *= 0.98;
    }
    
    // 透明度の更新
    const fadeStartTime = animationDuration * 0.6; // 60%経過後に徐々に消える
    if (timeSinceStart > fadeStartTime) {
      const fade = 1 - ((timeSinceStart - fadeStartTime) / (animationDuration - fadeStartTime));
      particlesMaterial.opacity = fade;
      sparklesMaterial.opacity = fade * 0.8;
    }
    
    particles.geometry.attributes.position.needsUpdate = true;
    sparkles.geometry.attributes.position.needsUpdate = true;
    
    // 次のフレームでも継続
    requestAnimationFrame(animateParticles);
  };
  
  // アニメーション開始
  animateParticles();
}

// ノードのランダム再配置
function randomizeNodes() {
  nodes.forEach((node, index) => {
    // ランダムな位置を生成
    const radius = 8;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);
    
    // 新しい位置を保存
    node.userData.originalPosition = new THREE.Vector3(x, y, z);
    
    // ノードを再表示
    node.visible = true;
    
    // 新しい位置にアニメーション
    gsap.fromTo(node.position, 
      { x: explosionPoint.x, y: explosionPoint.y, z: explosionPoint.z },
      { 
        x: x, 
        y: y, 
        z: z, 
        duration: 1.5,
        delay: index * 0.04, // 0.06→0.04に短縮
        ease: "elastic.out(1, 0.3)"
      }
    );
  });
});
  
  const starsVertices = [];
  for (let i = 0; i < 5000; i++) {
    const x = (Math.random() - 0.5) * 2000;
    const y = (Math.random() - 0.5) * 2000;
    const z = (Math.random() - 0.5) * 2000;
    starsVertices.push(x, y, z);
  }
  
  starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
  const stars = new THREE.Points(starsGeometry, starsMaterial);
  scene.add(stars);
}

// 情報ノードの作成
function createInfoNodes() {
  const categories = Object.keys(profileData);
  allNodes = categories.length;
  
  // 球の配置を螺旋状に計算
  for (let i = 0; i < categories.length; i++) {
    const phi = Math.acos(-1 + (2 * i) / categories.length);
    const theta = Math.sqrt(categories.length * Math.PI) * phi;
    
    const x = 8 * Math.cos(theta) * Math.sin(phi);
    const y = 8 * Math.sin(theta) * Math.sin(phi);
    const z = 8 * Math.cos(phi);
    
    createInfoNode(x, y, z, categories[i], i);
  }
}

// 個別のノードを作成
function createInfoNode(x, y, z, category, index) {
  // ノードの基本形状
  const geometry = new THREE.SphereGeometry(0.5, 32, 32);
  
  // グロー効果のためのシェーダーマテリアル
  const material = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      color: { value: new THREE.Color(0x5bbfc3) },
      discovered: { value: 0.0 }
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec2 vUv;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform vec3 color;
      uniform float discovered;
      varying vec3 vNormal;
      varying vec2 vUv;
      void main() {
        float pulse = 0.5 + 0.5 * sin(time * 2.0);
        float intensity = pow(0.7 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
        vec3 glow = color * (intensity + 0.3) * (pulse * 0.5 + 0.5);
        
        // ディスカバリー状態によってカラーを変更
        vec3 finalColor = mix(glow, vec3(1.0, 1.0, 1.0), discovered);
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `,
    transparent: true
  });
  
  const node = new THREE.Mesh(geometry, material);
  node.position.set(x, y, z);
  node.userData = {
    category: category,
    discovered: false,
    pulseSpeed: 0.5 + Math.random() * 1.5,
    originalPosition: new THREE.Vector3(x, y, z),
    amplitude: 0.2 + Math.random() * 0.3,
    index: index
  };
  
  // 時間差でノードを配置
  node.scale.set(0, 0, 0);
  setTimeout(() => {
    gsap.to(node.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 1.5,
      ease: "elastic.out(1, 0.3)",
      delay: index * 0.1
    });
  }, 1000);
  
  scene.add(node);
  nodes.push(node);
}

// ノード間の接続線を作成
function createConnections() {
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      if (Math.random() > 0.7) continue; // 70%の確率で接続をスキップ
      
      const startPoint = nodes[i].position;
      const endPoint = nodes[j].position;
      
      const points = [];
      points.push(startPoint);
      points.push(endPoint);
      
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color: 0x2a3b4c,
        transparent: true,
        opacity: 0.3
      });
      
      const line = new THREE.Line(geometry, material);
      line.userData = {
        startNodeIndex: i,
        endNodeIndex: j
      };
      
      scene.add(line);
    }
  }
}

// ウィンドウリサイズ時の処理
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  
  // モバイル検出を更新
  isMobile = detectMobile();
}

// マウス移動時の処理 (PC用)
function onMouseMove(event) {
  // モバイルの場合はスキップ
  if (isMobile) return;
  
  // マウス位置の正規化（-1から1の範囲）
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
  
  updateRaycaster(event.clientX, event.clientY);
}

// タッチ開始時の処理 (モバイル用)
function onTouchStart(event) {
  // シングルタッチのみ処理
  if (event.touches.length === 1) {
    const touch = event.touches[0];
    updateRaycaster(touch.clientX, touch.clientY);
  }
}

// タッチ移動時の処理 (モバイル用)
function onTouchMove(event) {
  if (event.touches.length === 1) {
    event.preventDefault(); // 画面スクロールを防止
  }
}

// タッチ終了時の処理 (モバイル用)
function onTouchEnd(event) {
  if (event.changedTouches.length === 1) {
    const touch = event.changedTouches[0];
    updateRaycaster(touch.clientX, touch.clientY);
    
    // ノードとの交差をチェック
    const intersects = raycaster.intersectObjects(nodes);
    if (intersects.length > 0) {
      handleNodeClick(intersects[0].object);
    }
  }
}

// レイキャスター更新とホバー効果 (PC/モバイル共通)
function updateRaycaster(clientX, clientY) {
  // マウス/タッチ位置の正規化（-1から1の範囲）
  mouse.x = (clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (clientY / window.innerHeight) * 2 + 1;
  
  // レイキャスターを更新
  raycaster.setFromCamera(mouse, camera);
  
  // ノードとの交差をチェック
  const intersects = raycaster.intersectObjects(nodes);
  
  // カーソルスタイルの更新
  if (intersects.length > 0) {
    if (!isMobile) {
      document.body.style.cursor = 'pointer';
      cursorDot.style.transform = 'translate(-50%, -50%) scale(1.5)';
      cursorRing.style.transform = 'translate(-50%, -50%) scale(1.5)';
      cursorRing.style.borderColor = 'rgba(91, 191, 195, 0.8)';
    }
    
    // ツールチップの表示
    const node = intersects[0].object;
    const category = node.userData.category;
    const data = profileData[category];
    
    nodeTooltip.textContent = data.title;
    nodeTooltip.style.opacity = '1';
    nodeTooltip.style.left = clientX + 'px';
    nodeTooltip.style.top = clientY + 'px';
    
  } else {
    if (!isMobile) {
      document.body.style.cursor = 'auto';
      cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
      cursorRing.style.transform = 'translate(-50%, -50%) scale(1)';
      cursorRing.style.borderColor = 'rgba(255, 255, 255, 0.5)';
    }
    
    // ツールチップを非表示
    nodeTooltip.style.opacity = '0';
  }
}

// クリック時の処理 (PC用)
function onClick(event) {
  // モバイルの場合はスキップ
  if (isMobile) return;
  
  // レイキャスターを更新
  raycaster.setFromCamera(mouse, camera);
  
  // ノードとの交差をチェック
  const intersects = raycaster.intersectObjects(nodes);
  
  if (intersects.length > 0) {
    handleNodeClick(intersects[0].object);
  }
}

// ノードクリック/タップ処理 (PC/モバイル共通)
function handleNodeClick(node) {
  const category = node.userData.category;
  const data = profileData[category];
  
  // ノードを発見済みにマーク
  if (!node.userData.discovered) {
    node.userData.discovered = true;
    node.material.uniforms.discovered.value = 1.0;
    
    // 発見エフェクト（パルス）
    gsap.to(node.scale, {
      x: 1.5,
      y: 1.5,
      z: 1.5,
      duration: 0.3,
      yoyo: true,
      repeat: 1
    });
    
    discoveredNodes++;
    updateDiscoveryProgress();
  }
  
  // パネルに情報を表示
  showInfoPanel(data.title, data.content);
  
  // カメラをノードに向ける
  gsap.to(controls.target, {
    x: node.position.x,
    y: node.position.y,
    z: node.position.z,
    duration: 1,
    ease: "power2.out",
    onUpdate: function() {
      controls.update();
    }
  });
}

// 情報パネルの表示
function showInfoPanel(title, content) {
  panelContent.innerHTML = `<h2>${title}</h2>${content}`;
  infoPanel.classList.add('active');
}

// 発見進捗の更新
function updateDiscoveryProgress() {
  discoveryCount.textContent = discoveredNodes;
  const percentage = (discoveredNodes / allNodes) * 100;
  discoveryProgress.style.width = percentage + '%';
  
  // すべて発見した場合の特別エフェクト
  if (discoveredNodes === allNodes && !celebrationComplete) {
    // パネルを閉じる
    infoPanel.classList.remove('active');
    
    // お祝いエフェクト
    createCelebrationEffect();
  }
}

// カスタムカーソルの設定 (PCのみ)
function setupCursor() {
  isMobile = detectMobile();
  
  if (!isMobile) {
    document.body.style.cursor = 'none';
    cursorDot.style.display = 'block';
    cursorRing.style.display = 'block';
    
    document.addEventListener('mousemove', (e) => {
      cursorDot.style.left = e.clientX + 'px';
      cursorDot.style.top = e.clientY + 'px';
      
      setTimeout(() => {
        cursorRing.style.left = e.clientX + 'px';
        cursorRing.style.top = e.clientY + 'px';
      }, 50);
    });

    document.addEventListener('mouseover', (e) => {
      if (e.target.classList.contains('interactive') || e.target.tagName === 'A' || e.target.id === 'nextStageButton' || e.target === panelClose) {
        cursorDot.style.transform = 'translate(-50%, -50%) scale(1.5)';
        cursorRing.style.transform = 'translate(-50%, -50%) scale(1.5)';
        cursorRing.style.borderColor = 'rgba(91, 191, 195, 0.8)';
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.classList.contains('interactive') || e.target.tagName === 'A' || e.target.id === 'nextStageButton' || e.target === panelClose) {
        cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorRing.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorRing.style.borderColor = 'rgba(255, 255, 255, 0.5)';
      }
    });
  }
  
  // モバイル向けヘルプテキストの設定
  if (isMobile) {
    helpTooltip.textContent = 'タップでノードを選択 | ドラッグで回転 | ピンチでズーム';
  } else {
    helpTooltip.textContent = 'マウスドラッグ: カメラ回転 | スクロール: ズーム | ノードをクリック: 情報表示';
  }
}

// Threeの初期化
function init() {
  // シーンの作成
  scene = new THREE.Scene();
  
  // カメラの設定
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 15;
  
  // レンダラーの設定
  renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('canvas'),
    antialias: true,
    alpha: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // パフォーマンス対策
  
  // 背景色を設定
  renderer.setClearColor(0x000000, 1);
  
  // レイキャスターとマウス位置の初期化
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();
  
  // コントロールの設定
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.rotateSpeed = isMobile ? 0.7 : 0.5; // モバイルは少し速く
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.5;
  controls.enableZoom = true;
  controls.zoomSpeed = 0.8;
  controls.minDistance = 5;
  controls.maxDistance = 30;
  
  // 光源の追加
  const ambientLight = new THREE.AmbientLight(0x404040, 1);
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);
  
  const pointLight = new THREE.PointLight(0x5bbfc3, 1, 50);
  pointLight.position.set(0, 0, 0);
  scene.add(pointLight);
  
  // 背景の星空を作成
  createStars();
  
  // 情報ノードの作成
  createInfoNodes();
  
  // 接続線の作成
  createConnections();
  
  // イベントリスナーの設定
  window.addEventListener('resize', onWindowResize);
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('click', onClick);
  
  // モバイル向けタッチイベント
  if (isMobile) {
    window.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);
  }
  
  // 次のステージボタンの設定
  nextStageButton.addEventListener('click', () => {
    window.location.href = 'https://tsubasato.weebly.com';
  });
  
  // ヘルプツールチップを表示
  setTimeout(() => {
    helpTooltip.classList.add('visible');
    setTimeout(() => {
      helpTooltip.classList.remove('visible');
    }, 6000);
  }, 3000);
  
  // ノード総数を表示
  totalNodes.textContent = allNodes;
  updateDiscoveryProgress();
  
  // 初回のアニメーションフレーム
  animate();
}
