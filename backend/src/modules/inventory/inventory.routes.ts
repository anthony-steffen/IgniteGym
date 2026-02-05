import { Router } from 'express';
import { InventoryController } from './inventory.controller';
import { SupplierController } from './supplier.controller';
import { CategoryController } from './category.controller'; // Incluindo para centralizar se desejar
import { authMiddleware } from '../../middlewares/authMiddleware';
import { roleMiddleware } from '../../middlewares/roleMiddleware';
import { tenantTranslate } from '../../middlewares/tenantTranslate';

const router = Router();
const productController = new InventoryController();
const supplierController = new SupplierController();
const categoryController = new CategoryController();

// Tradutor de slug: Sempre que houver ':slug' na rota, o middleware é chamado
router.param('slug', tenantTranslate);

router.use(authMiddleware);

// === PRODUTOS === //
router.get('/:slug/products', productController.listProducts);
router.post('/:slug/products', roleMiddleware(['ADMIN', 'MANAGER']), productController.createProduct);
router.put('/:slug/products/:id', roleMiddleware(['ADMIN', 'MANAGER']), productController.updateProduct);
router.delete('/:slug/products/:id', roleMiddleware(['ADMIN', 'MANAGER']), productController.deleteProduct);

// === FORNECEDORES === //
router.get('/:slug/suppliers', supplierController.listSuppliers);
router.post('/:slug/suppliers', roleMiddleware(['ADMIN', 'MANAGER']), supplierController.createSupplier);
router.put('/:slug/suppliers/:id', roleMiddleware(['ADMIN', 'MANAGER']), supplierController.updateSupplier);
router.delete('/:slug/suppliers/:id', roleMiddleware(['ADMIN', 'MANAGER']), supplierController.deleteSupplier);

// === CATEGORIAS === //
router.get('/:slug/categories', categoryController.list);
router.post('/:slug/categories', roleMiddleware(['ADMIN', 'MANAGER']), categoryController.create);
router.put('/:slug/categories/:id', roleMiddleware(['ADMIN', 'MANAGER']), categoryController.update);
router.delete('/:slug/categories/:id', roleMiddleware(['ADMIN', 'MANAGER']), categoryController.delete);

export default router;