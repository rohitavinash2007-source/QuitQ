using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QuitQ.Api.Models
{
    public class SellerProfile
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        [ForeignKey(nameof(UserId))]
        public User User { get; set; } = null!;

        [Required]
        [MaxLength(100)]
        public string StoreName { get; set; } = string.Empty;

        [MaxLength(500)]
        public string StoreDescription { get; set; } = string.Empty;

        [MaxLength(200)]
        public string BusinessAddress { get; set; } = string.Empty;

        [MaxLength(50)]
        public string GstNumber { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public ICollection<Product> Products { get; set; } = new List<Product>();
    }
}
