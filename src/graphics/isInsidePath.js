/**
 * @file isInsidePath.js
 * @author mengke01
 * @date 
 * @description
 * 判断点是否在path内部，射线法
 * TrueType uses the non-zero winding number rule.
 * https://developer.apple.com/fonts/TrueType-Reference-Manual/RM01/Chap1.html
 */


define(
    function(require) {
        var pathIterator = require('./pathIterator');
        var isBezierRayCross = require('./isBezierRayCross');
        var isSegmentRayCross = require('./isSegmentRayCross');

        /**
         * 判断点是否在path内部
         * 以p点的x轴向右射线为起点
         * 
         * @param {Object} path path对象
         * @param {Object} p 点对象
         * @return {boolean} 是否
         */
        function isInsidePath(path, p) {

            var zCount = 0, joint; 

            pathIterator(path, function (c, p0, p1, p2) {
                if (c === 'L') {

                    if((joint = isSegmentRayCross(p0, p1, p))) {
                        // 在直线上
                        if(joint[0].x == p.x) {
                            zCount = 1;
                            return false;
                        }
                        zCount += joint.length;
                    }
                }
                else if(c === 'Q') {

                    var ps = null;
                    var pe = null; 
                    
                    // 确定贝塞尔曲线的方向点
                    if((joint = isBezierRayCross(p0, p1, p2, p))) {

                        // 在曲线上
                        if(joint[0].x == p.x || joint[1] && joint[1].x == p.x) {
                            zCount = 1;
                            return false;
                        }

                        zCount += joint.length;
                    }
                }
            });

            return !!(zCount % 2);
        }

        return isInsidePath;
    }
);
