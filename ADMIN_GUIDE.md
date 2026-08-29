# Food Basket - Admin Panel Documentation

## 🎯 Dynamic Product Management

Your Food Basket website now supports **dynamic product management** through an easy-to-use Admin Panel!

## 📋 Features

### 1. **Add New Products**
- Add products without editing JSON files
- Simple form with 3 fields:
  - Product Name
  - Price (in ₹)
  - Image Filename
- Products appear immediately on the website

### 2. **Edit Existing Products**
- Modify product name, price, or image
- Click "Edit" button in the products table
- Changes reflect instantly

### 3. **Delete Products**
- Remove unwanted products with confirmation
- One-click deletion from the table

### 4. **Export Data**
- Download all products as JSON file
- Backup your product catalog
- File named with current date

### 5. **Template Download**
- Get a sample JSON template
- Understand the required format
- Quick reference for bulk additions

## 🚀 How to Use

### Accessing Admin Panel

1. **Sign In** to your account (top right)
2. Click on your **username** to open dropdown menu
3. Select **"Admin Panel"** (shield icon)

### Adding a New Product

1. Open Admin Panel
2. Fill in the form:
   ```
   Product Name: Margherita Pizza
   Price (₹): 299
   Image Filename: margherita.png
   ```
3. **Important**: Upload the image to `Products_Images/` folder first
4. Click **"Add Product"** button
5. Product appears on website immediately!

### Editing a Product

1. Find the product in the table
2. Click **"Edit"** button
3. Enter new values in the prompts
4. Changes save automatically

### Deleting a Product

1. Find the product in the table
2. Click **"Delete"** button
3. Confirm deletion
4. Product removed from website

### Exporting Products

1. Click **"Export Products (JSON)"** button
2. JSON file downloads automatically
3. File contains all current products
4. Use for backup or sharing

## 💾 Data Storage

### How It Works

- Products are stored in **browser's localStorage**
- Initial data loads from `Products.json`
- Admin changes override JSON data
- Data persists across browser sessions
- Each browser/device has separate data

### Important Notes

⚠️ **Backup Regularly**: Use Export feature to save your products

⚠️ **Image Files**: Always upload images to `Products_Images/` folder before adding product

⚠️ **Browser Specific**: Changes only apply to the current browser

⚠️ **Clear Cache**: Clearing browser data will reset to original JSON

## 📁 File Structure

```
Food Delivery Website/
├── Products_Images/          # Store all product images here
│   ├── burger.png
│   ├── pizza.png
│   └── [your-new-image.png]
├── Products.json             # Original product data (fallback)
├── admin.js                  # Admin panel functionality
├── admin-styles.css          # Admin panel styling
├── modals.js                 # Modal functionalities
└── main.js                   # Main website logic
```

## 🎨 Product Image Guidelines

### Recommended Format
- **Format**: PNG or JPG
- **Size**: 500x500 pixels (square)
- **Background**: Transparent or white
- **File Size**: Under 500KB
- **Naming**: lowercase, no spaces (e.g., `chicken-pizza.png`)

### Adding Images

1. Save image to `Products_Images/` folder
2. Use exact filename in Admin Panel
3. Include extension (.png, .jpg)

Example:
```
Products_Images/
  └── margherita-pizza.png

Admin Panel Form:
  Image Filename: margherita-pizza.png
```

## 🔄 Syncing Across Devices

Since data is stored in browser localStorage:

1. **Export** products from one browser
2. Open JSON file
3. **Copy** product data
4. **Add** products manually in another browser
   OR
5. Replace `Products.json` and clear localStorage

## 🛠️ Troubleshooting

### Product Not Showing?
- Check if image exists in `Products_Images/` folder
- Verify image filename matches exactly (case-sensitive)
- Refresh the page

### Lost Products After Clearing Browser?
- Products stored in localStorage were cleared
- Use your exported JSON backup
- Or data resets to original `Products.json`

### Image Not Loading?
- Check filename spelling
- Ensure file is in correct folder
- Try opening image directly: `Products_Images/yourimage.png`

## 📊 Product Data Format

Each product requires:

```json
{
    "id": 10,
    "name": "Product Name",
    "price": "₹299",
    "image": "filename.png"
}
```

- **id**: Auto-generated (unique number)
- **name**: Display name
- **price**: Must include ₹ symbol
- **image**: Filename with extension

## 🎓 Best Practices

1. ✅ **Backup Weekly**: Export products regularly
2. ✅ **Test Images**: Verify image loads before adding
3. ✅ **Consistent Naming**: Use clear, descriptive names
4. ✅ **Price Format**: Always use ₹ symbol
5. ✅ **Quality Images**: Use high-quality product photos

## 💡 Tips

- **Bulk Import**: Add multiple products to `Products.json`, then clear localStorage
- **Revert Changes**: Delete localStorage item `foodBasketProducts` to reset
- **Preview**: Add product, check website, edit if needed
- **Organization**: Keep product images organized in subfolders if needed

## 🔐 Security Note

The Admin Panel is currently open to all logged-in users. For production:
- Add admin role/permission check
- Implement server-side validation
- Store data in a database
- Add authentication middleware

## 📞 Support

For issues or questions:
- Check console for error messages (F12)
- Verify all files are in correct locations
- Ensure Products.json has valid JSON format

---

**Happy Managing! 🎉**

Your Food Basket website now grows with your business!
