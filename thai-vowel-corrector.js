/*!
 * Copyright (c) 2011 Opendream Co., LTD. (http://opendream.co.th)
 * Licensed under the MIT license.
 * 
 * Based on algorithm from jthaipdf (http://code.google.com/p/jthaipdf).
 */

/**
 * Replace floating vowel with proper private Thai unicode characters. Main use
 * with cufon (http://cufon.shoqolate.com).
 * 
 * @param Original text.
 * @return Modified text.
 */
var correctThaiFloatingVowel = (function () {
  
  /**
   * @return string from character code provided.
   */
  var _ = function (code) {
    return String.fromCharCode(code);
  };
  
  var
    // Lower level characters
    SARA_U  = _(0xE38),
    SARA_UU = _(0xE39),
    PHINTHU = _(0xE3A),

    // Lower level characters after pullDown
    SARA_U_DOWN  = _(0xF718),
    SARA_UU_DOWN = _(0xF719),
    PHINTHU_DOWN = _(0xF71A),

    // Upper level 1 characters
    MAI_HAN_AKAT = _(0xE31),
    SARA_AM      = _(0xE33),
    SARA_I       = _(0xE34),
    SARA_Ii      = _(0xE35),
    SARA_Ue      = _(0xE36),
    SARA_Uee     = _(0xE37),
    MAI_TAI_KHU  = _(0xE47),

    // Upper level 1 characters after shift left
    MAI_HAN_AKAT_LEFT_SHIFT = _(0xF710),
    SARA_I_LEFT_SHIFT       = _(0xF701),
    SARA_Ii_LEFT_SHIFT      = _(0xF702),
    SARA_Ue_LEFT_SHIFT      = _(0xF703),
    SARA_Uee_LEFT_SHIFT     = _(0xF704),
    MAI_TAI_KHU_LEFT_SHIFT  = _(0xF712),

    // Upper level 2 characters
    MAI_EK      = _(0xE48),
    MAI_THO     = _(0xE49),
    MAI_TRI     = _(0xE4A),
    MAI_CHATTAWA = _(0xE4B),
    THANTHAKHAT = _(0xE4C),
    NIKHAHIT    = _(0xE4D),

    // Upper level 2 characters after pull down
    MAI_EK_DOWN      = _(0xF70A),
    MAI_THO_DOWN     = _(0xF70B),
    MAI_TRI_DOWN     = _(0xF70C),
    MAI_CHATTAWA_DOWN = _(0xF70D),
    THANTHAKHAT_DOWN = _(0xF70E),

    // Upper level 2 characters after pull down and shift left
    MAI_EK_PULL_DOWN_AND_LEFT_SHIFT      = _(0xF705),
    MAI_THO_PULL_DOWN_AND_LEFT_SHIFT     = _(0xF706),
    MAI_TRI_PULL_DOWN_AND_LEFT_SHIFT     = _(0xF707),
    MAI_CHATTAWA_PULL_DOWN_AND_LEFT_SHIFT = _(0xF708),
    THANTHAKHAT_PULL_DOWN_AND_LEFT_SHIFT = _(0xF709),

    // Upper level 2 characters after shift left
    MAI_EK_LEFT_SHIFT       = _(0xF713),
    MAI_THO_LEFT_SHIFT      = _(0xF714),
    MAI_TRI_LEFT_SHIFT      = _(0xF715),
    MAI_CHATTAWA_LEFT_SHIFT = _(0xF716),
    THANTHAKHAT_LEFT_SHIFT  = _(0xF717),
    NIKHAHIT_LEFT_SHIFT     = _(0xF711),

    // Up tail characters
    PO_PLA  = _(0x0E1B),
    FO_FA   = _(0x0E1D),
    FO_FAN  = _(0x0E1F),
    LOchULA = _(0x0E2C),

    // Down tail characters
    THO_THAN = _(0xE10),
    YO_YING  = _(0xE0D),
    DOchADA  = _(0xE0E),
    TO_PATAK = _(0xE0F),
    RU       = _(0xE24),
    LU       = _(0xE26),

    // Cut tail characters
    THO_THAN_CUT_TAIL = _(0xF700),
    YO_YING_CUT_TAIL  = _(0xF70F),

    // for exploded SARA_AM (NIKHAHIT + SARA_AA)
    SARA_AA = _(0xE32);

    var explodeSaraAm = function (content) {
      var count = countSaraAm(content);

      if (count === 0) {
        return content;
      }

      var
        newContent = '',
        i = 0,
        j = 0,
        ch = '';

      // Exploded SARA_AM to NIKHAHIT + SARA_AA
      for (i = 0; i < content.length; i++) {
        ch = content[i];
        
        if (i < content.length - 1  && content[i + 1] == SARA_AM) {
          if (isUpperLevel2(ch)) {
            newContent += NIKHAHIT;
            newContent += ch;
          }
          else {
            newContent += ch;
            newContent += NIKHAHIT;
          }
        }
        else if (ch == SARA_AM){
          newContent += SARA_AA;
        }
        else {
          newContent += ch;
        }
      }
      
      return newContent;
    };

    var countSaraAm = function(content) {
      var
        count = 0,
        i = 0;

      for (i = 0; i < content.length; i++) {
        if (content[i] == SARA_AM) {
          count++;
        }
      }

      return count;
    };

    var isUpTail = function (ch) {
      return ch == PO_PLA || ch == FO_FA || ch == FO_FAN
             || ch == LOchULA;
    };

    var isDownTail = function (ch) {
      return ch == THO_THAN || ch == YO_YING || ch == DOchADA
             || ch == TO_PATAK || ch == RU || ch == LU;
    };

    var isUpperLevel1 = function (ch) {
      return ch == MAI_HAN_AKAT || ch == SARA_I || ch == SARA_Ii
             || ch == SARA_Ue || ch == SARA_Uee || ch == MAI_TAI_KHU
             || ch == NIKHAHIT;
    };

    var isLeftShiftUpperLevel1 = function (ch) {
      return ch == MAI_HAN_AKAT_LEFT_SHIFT || ch == SARA_I_LEFT_SHIFT
             || ch == SARA_Ii_LEFT_SHIFT || ch == SARA_Ue_LEFT_SHIFT
             || ch == SARA_Uee_LEFT_SHIFT || ch == MAI_TAI_KHU_LEFT_SHIFT
             || ch == NIKHAHIT_LEFT_SHIFT;
    };

    var isUpperLevel2 = function (ch) {
      return ch == MAI_EK || ch == MAI_THO || ch == MAI_TRI
             || ch == MAI_CHATTAWA || ch == THANTHAKHAT;
    };

    var isLowerLevel = function (ch) {
      return ch == SARA_U || ch == SARA_UU || ch == PHINTHU;
    };

    var pullDownAndShiftLeft = function (ch) {
      switch (ch) {
        case MAI_EK:
          return MAI_EK_PULL_DOWN_AND_LEFT_SHIFT;

        case MAI_THO:
          return MAI_THO_PULL_DOWN_AND_LEFT_SHIFT;

        case MAI_TRI:
          return MAI_TRI_PULL_DOWN_AND_LEFT_SHIFT;

        case MAI_CHATTAWA:
          return MAI_CHATTAWA_PULL_DOWN_AND_LEFT_SHIFT;

        case MAI_HAN_AKAT:
          return MAI_HAN_AKAT_LEFT_SHIFT;

        case THANTHAKHAT:
          return THANTHAKHAT_PULL_DOWN_AND_LEFT_SHIFT;

        default:
          return ch;
      }
    };

    var shiftLeft = function (ch) {
      switch (ch) {
        case MAI_EK:
          return MAI_EK_LEFT_SHIFT;

        case MAI_THO:
          return MAI_THO_LEFT_SHIFT;

        case MAI_TRI:
          return MAI_TRI_LEFT_SHIFT;

        case MAI_CHATTAWA:
          return MAI_CHATTAWA_LEFT_SHIFT;

        case MAI_HAN_AKAT:
          return MAI_HAN_AKAT_LEFT_SHIFT;

        case SARA_I:
          return SARA_I_LEFT_SHIFT;

        case SARA_Ii:
          return SARA_Ii_LEFT_SHIFT;

        case SARA_Ue:
          return SARA_Ue_LEFT_SHIFT;

        case SARA_Uee:
          return SARA_Uee_LEFT_SHIFT;

        case MAI_TAI_KHU:
          return MAI_TAI_KHU_LEFT_SHIFT;

        case NIKHAHIT:
          return NIKHAHIT_LEFT_SHIFT;

        default:
          return ch;
      }
    };

    var pullDown = function (ch) {
      switch (ch) {
        case MAI_EK:
          return MAI_EK_DOWN;

        case MAI_THO:
          return MAI_THO_DOWN;

        case MAI_TRI:
          return MAI_TRI_DOWN;

        case MAI_CHATTAWA:
          return MAI_CHATTAWA_DOWN;

        case THANTHAKHAT:
          return THANTHAKHAT_DOWN;

        case SARA_U:
          return SARA_U_DOWN;

        case SARA_UU:
          return SARA_UU_DOWN;

        case PHINTHU:
          return PHINTHU_DOWN;

        default:
          return ch;
      }
    };

    var cutTail = function (ch) {
      switch(ch) {
        case THO_THAN:
          return THO_THAN_CUT_TAIL;

        case YO_YING:
          return YO_YING_CUT_TAIL;

        default:
          return ch;
      }
    };

    /**
     * Rearrange Thai glyph
     * @param content
     * @return string for display
     */
    var do_modify = function (content) {
      content = explodeSaraAm(content || '');
      content = content.split(''); // string cannot be modified in javascript,
                                   // then convert it to array for convenient.

      var
        length = content.length,
        pch = 'a'; // previous character start with dummy value

      var
        i = 0,
        ch = '',
        cutch = '';

      // Replace upper and lower character with un-overlapped character
      for (i = 0; i < length; i++) {
        ch = content[i];

        if (isUpperLevel1(ch) && isUpTail(pch)) { // Level 1 and up-tail
          content[i] = shiftLeft(ch);
        }
        else if (isUpperLevel2(ch)) {
          
          // Level 2
          if (isLowerLevel(pch)) {
            pch = content[i - 2];
          }

          if (isUpTail(pch)) {
            content[i] = pullDownAndShiftLeft(ch);
          }
          else if (isLeftShiftUpperLevel1(pch)) {
            content[i] = shiftLeft(ch);
          }
          else if (!isUpperLevel1(pch)) {
            content[i] = pullDown(ch);
          }
        }
        else if (isLowerLevel(ch) && isDownTail(pch)) { // Lower level and down-tail
          cutch = cutTail(pch);

          if (pch != cutch) {
            content[i - 1] = cutch;
          }
          else {
            content[i] = pullDown(ch);
          }
        }

        pch = content[i];
      }

      return content.join('');
    };

    return function (text) {
      return do_modify(text);
    };

})();
