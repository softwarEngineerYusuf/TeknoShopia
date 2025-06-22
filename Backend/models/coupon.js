const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const couponSchema = new Schema(
  {
    // Kupon Kodu: Kullanıcının gireceği benzersiz kod (örn: YAZ25, HOSGELDIN)
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true, // Kodları her zaman büyük harf olarak saklar, tutarlılık sağlar (yaz25 = YAZ25)
      trim: true, // Başındaki ve sonundaki boşlukları temizler
    },

    // İndirim Türü: İndirimin yüzde mi yoksa sabit bir tutar mı olduğunu belirtir.
    discountType: {
      type: String,
      required: true,
      enum: ["percentage", "fixedAmount"], // Sadece bu iki değerden birini alabilir
      default: "percentage",
    },

    // İndirim Değeri: 'discountType'a bağlı olarak yüzde veya TL tutarı.
    discountValue: {
      type: Number,
      required: true,
      min: 0, // Negatif indirim olamaz
    },

    // Açıklama: Kuponun ne işe yaradığı (örn: "Yaz İndirimi", "Yeni Üyelere Özel")
    description: {
      type: String,
      required: true,
    },

    // Başlangıç ve Bitiş Tarihleri: Kuponun geçerlilik süresi.
    startDate: {
      type: Date,
      required: true,
      default: Date.now, // Oluşturulduğu an başlar
    },
    endDate: {
      type: Date,
      required: true,
    },

    // Minimum Sepet Tutarı: Kuponun uygulanabilmesi için gereken en düşük sepet tutarı.
    minPurchaseAmount: {
      type: Number,
      default: 0, // 0 ise minimum tutar şartı yok demektir.
    },

    // Kullanım Limiti: Bu kuponun toplamda kaç kere kullanılabileceği.
    usageLimit: {
      type: Number,
      default: 1, // Varsayılan olarak her kupon sadece 1 kez kullanılabilir
    },

    // Kullanım Sayısı: Bu kuponun şu ana kadar kaç kere kullanıldığı.
    timesUsed: {
      type: Number,
      default: 0,
    },

    // Kullanıcıya Özel mi?: Kuponun belirli kullanıcılara mı yoksa herkese mi açık olduğunu belirtir.
    isUserSpecific: {
      type: Boolean,
      default: false,
    },

    // Geçerli Kullanıcılar: Eğer 'isUserSpecific' true ise, bu kuponu kullanabilecek kullanıcıların ID'leri.
    applicableUsers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Aktif mi?: Kuponu manuel olarak devre dışı bırakmak için.
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // createdAt ve updatedAt alanlarını otomatik ekler
  }
);

module.exports = mongoose.model("Coupon", couponSchema);
