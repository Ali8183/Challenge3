# React Native Tamagotchi (Dijital Evcil Hayvan) 🐾

Bu proje, React Native kullanılarak geliştirilmiş modern ve "Production Ready" (canlıya çıkmaya hazır) bir **Tamagotchi (Dijital Evcil Hayvan)** bileşenini içerir. İlk başta sadece mantıksal bir iskelet (ham bir kod) olarak başlayan yapı, daha sonra modern arayüz standartlarına uygun, güvenli (defensive programming) ve dinamik geri bildirimler sunan şık bir formata refactor edilmiştir.

## ✨ Özellikler

- **Modern Arayüz (Card UI):** Yuvarlatılmış köşeler, yumuşak gölgelendirme (shadow/elevation) ve esnek (flexbox) tasarım mimarisiyle tam merkezlenen kullanıcı dostu bir kart tasarımı.
- **Defensive Programming:** Açlık ve mutluluk değerleri, mantıksal sınırların (`0 - 100`) dışına çıkmaması için `Math.min()` ve `Math.max()` ile güvenlik altına alınmıştır.
- **Dinamik Emojiler:** Evcil hayvanınızın mutluluk seviyesine göre anlık olarak tepkileri değişir:
  - `> 80` Mutluluk: 🤩 (Çok Mutlu)
  - `>= 50` Mutluluk: 😊 (Mutlu)
  - `>= 30` Mutluluk: 😐 (Orta)
  - `< 30` Mutluluk: 🥺 (Üzgün)
- **Görsel Geri Bildirim (UI Feedback):** Evcil hayvanın açlık seviyesi 70'i aştığında tehlikeyi belli etmek adına kartın arka planı kırmızı/pastel uyarı rengine (`#ffcccc`) dönüşür.
- **Özel Butonlar:** Standart `<Button>` yerine, dokunma hissi (opacity) veren özelleştirilebilir `<TouchableOpacity>` butonları kullanılmıştır.

## 🛠 Kullanılan Teknolojiler

- **React Native (Expo)**
- **React Hooks** (`useState`)
- **JavaScript (ES6+)**
- **Flexbox Mimarisi** (StyleSheet)

## 🚀 Kurulum ve Çalıştırma

Projeyi kendi bilgisayarınızda çalıştırmak için aşağıdaki adımları takip edebilirsiniz:

1. **Repoyu Klonlayın:**
   ```bash
   git clone https://github.com/Ali8183/Challenge3.git
   cd Challenge3
   ```

2. **Bağımlılıkları Yükleyin:**
   Eğer projenin kök dizinindeyseniz bağımlılıkları indirin:
   ```bash
   npm install
   ```

3. **Projeyi Başlatın:**
   Expo sunucusunu başlatmak için şu komutu çalıştırın:
   ```bash
   npx expo start
   ```

4. **Test Edin:**
   - Ekranda çıkan QR kodu **Expo Go** uygulaması (Android/iOS) ile okutabilirsiniz.
   - Veya bilgisayarınızda Android Emulator ya da iOS Simulator açıksa komut satırında `a` veya `i` tuşlarına basarak başlatabilirsiniz.

## 📁 Proje Yapısı

Öne çıkan dosyalar:
- **`App.js`**: Uygulamanın giriş noktasıdır ve `Tamagotchi` bileşenini ekrana çizer.
- **`Tamagotchi.js`**: Asıl uygulamanın mantığını ve arayüzünü (UI) barındıran temel bileşendir.

## 💡 Code Review & Refactoring Notları

Bu proje geliştirilirken uygulanan bazı en iyi pratikler (best practices):

- **State Güvenliği:** Doğrudan hesaplamalar kod kalmazlığına yol açabileceği için `setAclik((prev) => Math.max(0, prev - 10));` mantığı kullanıldı.
- **Koşullu Renderın Ayrıştırılması:** Arayüzün karmaşıklaşmasını önlemek adına, emojiyi ekrana asan koşullu (if/else) mantığı `getEmoji()` gibi ayrı bir fonksiyon içine alınarak ("Separation of Concerns") kodun okunabilirliği arttırıldı.
- **Esnek Yapı:** Butonlar ve içerik için katı pixel/marginTop değerleri yerine platform bağımsız çalışan pürüzsüz `flexDirection` ve `gap` Flex Architecture kuralları tercih edildi.

---

**Geliştirici:** Ali8183 & UX Doctor AI
