import { ClearCacheModule } from './clear-cache.module';

describe('ClearCacheModule', () => {
    let loginModule: ClearCacheModule;

    beforeEach(() => {
        loginModule = new ClearCacheModule();
    });

    it('should create an instance', () => {
        expect(loginModule).toBeTruthy();
    });
});
