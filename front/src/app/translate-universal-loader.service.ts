import { TranslateLoader } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';

// import translation
import * as contentEn from '../assets/i18n/en.json';
import * as contentRu from '../assets/i18n/ru.json';

// declaare translation
const TRANSLATIONS = {
    en: contentEn,
    ru: contentRu,
};

/**
 *
 *
 * @export
 * @class TranslateUniversalLoaderService
 * @implements {TranslateLoader}
 */
export class TranslateUniversalLoaderService implements TranslateLoader {
    /**
     *
     *
     * @param {string} lang
     * @return {*}  {Observable<any>}
     */
    getTranslation ( lang: string ): Observable<any> {
        return of( ( TRANSLATIONS as any )[lang].default );
    }
}
