# Detaylı  Promt


# Virtual Try-On Uygulaması - Kullanım Kılavuzu

## 🎯 Özellikler

- AI destekli sanal kıyafet deneme
- Kamera, galeri veya URL ile resim seçimi
- Geçmiş ve favori kayıtlar
- Karşılaştırmalı görüntüleme
- Türkçe hata mesajları

## 🚀 Başlangıç

### Uygulamayı Başlatma

```bash
npm run dev
```

Tarayıcınızda otomatik olarak açılacaktır.

## 📱 Kullanım Adımları

### 1. Resim Seçimi

1. Ana sayfada "Try Virtual Outfit" butonuna tıklayın
2. İki resim seçmeniz gerekiyor:
   - **Kişi Resmi**: Kendiniziın veya deneme yapacak kişinin fotoğrafı
   - **Kıyafet Resmi**: Denemek istediğiniz kıyafetin fotoğrafı

### 2. Resim Yükleme Yöntemleri

Her resim için 3 farklı yöntem kullanabilirsiniz:

- **📷 Kamera**: Anlık fotoğraf çekin (mobil cihazlarda)
- **🖼️ Galeri**: Galerinizdeki fotoğrafları seçin
- **🔗 URL**: İnternet üzerindeki resim linkini yapıştırın

### 3. Try-On İşlemi

1. Her iki resmi de seçtikten sonra "Generate Try-On" butonu aktif olacak
2. Butona tıklayın
3. AI işlem sırasında ilerleme göreceksiniz (15-30 saniye)
4. İşlem tamamlandığında sonuç ekranına yönlendirileceksiniz

### 4. Sonuç Ekranı

Sonuç ekranında şunları yapabilirsiniz:

- **3 Panel Görüntüleme**: Orijinal kişi, kıyafet ve sonuç resmini görün
- **💖 Favorilere Ekle**: Beğendiğiniz sonuçları favorilere kaydedin
- **📥 İndir**: Sonuç resmini cihazınıza indirin (yakında)
- **📤 Paylaş**: Sosyal medyada paylaşın (yakında)
- **🔗 URL Kopyala**: Resim linkini kopyalayın

## 📋 İpuçları

### En İyi Sonuç İçin:

✅ **Kişi Resmi İçin:**
- Net ve iyi ışıklı fotoğraflar kullanın
- Kişi kameraya doğru bakmalı
- Tam boy veya üst gövde fotoğrafları en iyi sonucu verir
- Sade arka plan tercih edin

✅ **Kıyafet Resmi İçin:**
- Kıyafet net görünmeli
- İyi aydınlatma önemli
- Düz zemin veya manken üzerinde olan fotoğraflar idealdir
- Tek kıyafet içeren fotoğraflar kullanın

## 🔧 Sorun Giderme

### "Generate Try-On" butonu çalışmıyor

- Her iki resmin de seçildiğinden emin olun
- Seçilen resimlerin geçerli URL'ler olduğunu kontrol edin
- İnternet bağlantınızı kontrol edin

### İşlem çok uzun sürüyor

- Normal işlem süresi 15-30 saniyedir
- 45 saniyeden uzun sürerse otomatik olarak zaman aşımı hatası alırsınız
- "Retry" butonuyla tekrar deneyebilirsiniz

### Hata mesajları

Uygulama Türkçe hata mesajları gösterir:

- **"İnternet bağlantınızı kontrol edin"**: İnternet bağlantısı sorunu
- **"Geçersiz resim URL'leri"**: Resim linkleri hatalı
- **"AI servisi şu anda kullanılamıyor"**: Servis geçici olarak down
- **"İstek zaman aşımına uğradı"**: İşlem çok uzun sürdü

## 📊 Geçmiş ve Favoriler

### Geçmiş (History)

- Alt menüden "History" sekmesine tıklayın
- Tüm deneme geçmişinizi görün
- Yenile (pull-to-refresh) ile güncelleyin
- Uzun basarak silebilirsiniz

### Favoriler (Favorites)

- Alt menüden "Favorites" sekmesine tıklayın
- Favorilere eklediğiniz tüm denemeleri görün
- Kalp ikonu ile favorilere ekleyip çıkarabilirsiniz

## 🎨 Örnek Resimler

Uygulama içinde test için örnek resimler bulunmaktadır:
- Ana sayfada "Sample Gallery" bölümüne bakın
- "Try Sample" linkine tıklayarak örnek resimlerle hızlıca test edebilirsiniz

## ⚙️ Teknik Detaylar

- **AI Motoru**: fal.ai Virtual Try-On API
- **Database**: Supabase (geçmiş ve favoriler için)
- **Timeout**: 45 saniye
- **Desteklenen Format**: JPG, PNG, WebP

## 🆘 Destek

Sorun yaşarsanız:

1. Tarayıcı konsolunu açın (F12) ve hata mesajlarına bakın
2. İnternet bağlantınızı kontrol edin
3. Farklı resimler deneyin
4. Uygulamayı yenileyin (F5)

---

**Not**: Bu uygulama AI teknolojisi kullandığından, sonuçlar her zaman %100 gerçekçi olmayabilir. En iyi sonuç için yukarıdaki ipuçlarını takip edin.
